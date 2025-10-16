import os
import time
from dotenv import load_dotenv
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

index_name = "stockpulse-db"
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
index = pc.Index(index_name)
vector_store = PineconeVectorStore(index=index, embedding=embeddings)
retriever = vector_store.as_retriever(search_kwargs={"k": 3})
llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        api_key=os.getenv("GEMINI_API_KEY"),
    )
_STORE = {}
SESSION_LIFETIME = 600 


def cleanup_sessions():
    current_time = time.time()
    expired_sessions = [
        sid for sid, data in _STORE.items()
        if current_time - data["timestamp"] > SESSION_LIFETIME
    ]
    for sid in expired_sessions:
        del _STORE[sid]


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    cleanup_sessions()
    if session_id not in _STORE:
        _STORE[session_id] = {
            "history": ChatMessageHistory(),
            "timestamp": time.time()
        }
    else:
        _STORE[session_id]["timestamp"] = time.time()
    return _STORE[session_id]["history"]


def get_conversational_rag_chain():
    contextualize_q_system_prompt = """Given a chat history and the latest user question 
    which might reference context in the chat history, formulate a standalone question 
    which can be understood without the chat history. Do NOT answer the question, 
    just reformulate it if needed and otherwise return it as is."""
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    qa_system_prompt = """You are a friendly and professional financial chatbot specializing in stocks and finance. Your purpose is to educate and inform users based on the information provided in the context. 
    When a user asks a question, please follow these guidelines:
    - Answer Directly: Use the provided context to answer the question clearly and concisely.
    - If the question is unrelated to stocks or finance, politely inform the user that you can only assist with finance-related queries.
    - Be Helpful: If the answer is not in the context, gently state that you don't have that specific information.
    - Stay in Character: Maintain a professional but approachable tone. Avoid jargon where possible, or explain it simply.
    \n\n{context}"""
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    conversational_rag_chain = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )

    return conversational_rag_chain


def get_rag_response(query: str, session_id: str):
    conversational_rag_chain = get_conversational_rag_chain()
    response = conversational_rag_chain.invoke(
        {"input": query},
        config={"configurable": {"session_id": session_id}}
    )
    return response["answer"]

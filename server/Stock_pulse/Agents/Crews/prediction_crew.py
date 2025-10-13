from crewai import Agent, Crew, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
from pathlib import Path
from .models import PredictionOutput
from .tools import get_company_news_summaries, get_stock_with_indicators
load_dotenv()

llm = LLM(
    model="gemini/gemini-2.0-flash",
    temperature=0.7,
    api_key=os.getenv("GEMINI_API_KEY")
)

@CrewBase
class PredictionCrew():
    
    _config_dir = Path(__file__).resolve().parent.parent / 'config'
    agents_config = f'{_config_dir}/agents.yaml'
    tasks_config = f'{_config_dir}/tasks.yaml'

    @agent
    def TechnicalAnalysisAgent(self) -> Agent:
        return Agent(config = self.agents_config['TechnicalAnalysisAgent'], llm=llm)
    @agent
    def SentimentAnalysisAgent(self) -> Agent:
        return Agent(config = self.agents_config['SentimentAnalysisAgent'], llm=llm) 
    @agent
    def PredictionAgent(self) -> Agent:
        return Agent(config = self.agents_config['PredictionAgent'], llm=llm)
    
    @task
    def TechnicalAnalysisTask(self) -> Task:
        return Task(config = self.tasks_config['TechnicalAnalysis'], tools=[get_stock_with_indicators])
    @task
    def SentimentAnalysisTask(self) -> Task:
        return Task(config = self.tasks_config['SentimentAnalysis'], tools=[get_company_news_summaries])
    @task
    def PredictionTask(self) -> Task:  
        return Task(config = self.tasks_config['Prediction'], output_json=PredictionOutput)

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=[
                self.TechnicalAnalysisAgent(),
                self.SentimentAnalysisAgent(),
                self.PredictionAgent()
            ],
            tasks=[
                self.TechnicalAnalysisTask(),
                self.SentimentAnalysisTask(),
                self.PredictionTask()
            ],
        )

# crew_instance = PredictionCrew().crew()
# res = crew_instance.kickoff(inputs={"ticker": "Blackrock"})
# print(res)  # Print the entire result object
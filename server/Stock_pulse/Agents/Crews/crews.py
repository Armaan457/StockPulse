import os
from pathlib import Path
from dotenv import load_dotenv

from crewai import Agent, Crew, Task, Process, LLM
from crewai.project import CrewBase, agent, crew, task

from .models import PredictionOutput
from .tools import (
    get_company_news_summaries,
    get_stock_with_indicators,
    get_portfolio_with_indicators,
    get_portfolio_news_summaries,
)

load_dotenv()

llm = LLM(
    model="google/gemini-2.5-flash",
    temperature=0.7,
    api_key=os.getenv("GOOGLE_API_KEY")
)


@CrewBase
class StockCrews():

    _config_dir = Path(__file__).resolve().parent.parent / 'config'
    agents_config = f'{_config_dir}/agents.yaml'
    tasks_config = f'{_config_dir}/tasks.yaml'

    @agent
    def FinancialAnalystAgent(self) -> Agent:
        return Agent(config=self.agents_config['FinancialAnalystAgent'], llm=llm, verbose=True)

    @agent
    def MarketNewsReporterAgent(self) -> Agent:
        return Agent(config=self.agents_config['MarketNewsReporterAgent'], llm=llm, verbose=True)

    @agent
    def DiversityAssessorAgent(self) -> Agent:
        return Agent(config=self.agents_config['DiversityAssessorAgent'], llm=llm, verbose=True)

    @agent
    def PortfolioStrategistAgent(self) -> Agent:
        return Agent(config=self.agents_config['PortfolioStrategistAgent'], llm=llm, verbose=True)

    @task
    def AnalyzeStocks(self) -> Task:
        return Task(config=self.tasks_config['AnalyzeStocks'], tools=[get_portfolio_with_indicators])

    @task
    def GetPortfolioNews(self) -> Task:
        return Task(config=self.tasks_config['GetPortfolioNews'], tools=[get_portfolio_news_summaries])

    @task
    def EvaluateDiversity(self) -> Task:
        return Task(config=self.tasks_config['EvaluateDiversity'])

    @task
    def GeneratePortfolioReport(self) -> Task:
        return Task(config=self.tasks_config['GeneratePortfolioReport'])

    @crew
    def PortfolioCrew(self) -> Crew:
        return Crew(
            agents=[
                self.FinancialAnalystAgent(),
                self.MarketNewsReporterAgent(),
                self.DiversityAssessorAgent(),
                self.PortfolioStrategistAgent(),
            ],
            tasks=[
                self.AnalyzeStocks(),
                self.GetPortfolioNews(),
                self.EvaluateDiversity(),
                self.GeneratePortfolioReport(),
            ],
            process=Process.sequential,
        )


    @agent
    def TechnicalAnalysisAgent(self) -> Agent:
        return Agent(config=self.agents_config['TechnicalAnalysisAgent'], llm=llm, verbose=True)

    @agent
    def SentimentAnalysisAgent(self) -> Agent:
        return Agent(config=self.agents_config['SentimentAnalysisAgent'], llm=llm, verbose=True)

    @agent
    def PredictionAgent(self) -> Agent:
        return Agent(config=self.agents_config['PredictionAgent'], llm=llm)

    @task
    def TechnicalAnalysisTask(self) -> Task:
        return Task(config=self.tasks_config['TechnicalAnalysis'], tools=[get_stock_with_indicators])

    @task
    def SentimentAnalysisTask(self) -> Task:
        return Task(config=self.tasks_config['SentimentAnalysis'], tools=[get_company_news_summaries])

    @task
    def PredictionTask(self) -> Task:
        return Task(config=self.tasks_config['Prediction'], output_json=PredictionOutput)

    @crew
    def PredictionCrew(self) -> Crew:
        return Crew(
            agents=[
                self.TechnicalAnalysisAgent(),
                self.SentimentAnalysisAgent(),
                self.PredictionAgent(),
            ],
            tasks=[
                self.TechnicalAnalysisTask(),
                self.SentimentAnalysisTask(),
                self.PredictionTask(),
            ],
        )


# Example usage (commented out):
# stock_crews = StockCrews()
# portfolio_res = stock_crews.PortfolioCrew().kickoff(inputs={"portfolio_tickers": ["AAPL", "GOOGL", "MSFT"]})
# prediction_res = stock_crews.PredictionCrew().kickoff(inputs={"ticker": "BRK.B"})
# print(portfolio_res)
# print(prediction_res)

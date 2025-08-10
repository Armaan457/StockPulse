# # app_name/tasks.py
# from celery import shared_task
# import requests

# @shared_task
# def download_nasdaq_data():
#     url = "https://www.nasdaq.com/market-activity/stocks/screener.csv"
#     response = requests.get(url)
#     if response.status_code == 200:
#         file_path = "ticker.csv"
#         with open(file_path, "wb") as file:
#             file.write(response.content)
#     else:
#         print(f"Failed to download data. Status code: {response.status_code}")
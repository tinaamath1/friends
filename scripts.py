from bs4 import BeautifulSoup
import requests

url = "https://fangj.github.io/friends/season/1.html" 
response = requests.get(url)


if response.status_code == 200:
    html_content = response.text
else:
    print("Failed to fetch the webpage.")

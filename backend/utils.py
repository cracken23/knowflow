from openai import OpenAI
import requests
import re
import os
from dotenv import load_dotenv
load_dotenv()

# def call_llm(prompt):
#     """
#     Call the local Ollama LLM with the provided prompt.
#     Ensure that the Ollama server is running and the 'llama3.2:3b' model is available.
#     """
#     client = OpenAI(
#         base_url='http://localhost:11434/v1',
#         api_key='ollama'  # Required but unused
#     )
#     response = client.chat.completions.create(
#         model="llama3.2:3b",
#         messages=[{"role": "user", "content": prompt}]
#     )
#     return response.choices[0].message.content

def dep_call_llm(prompt):
   api_key = os.getenv("OPENROUTER_API_KEY")
   if not api_key:
      raise ValueError("OPENROUTER_API_KEY environment variable is not set.")
   url = 'http://localhost:11434/api/generate'
   data = {
       "model": "llama3.2:3b",
        "prompt": prompt,
        "stream": False,
   }
   response = requests.post(url, json=data)
   #cleaned_response = re.sub(r"<think>.*?</think>", "", response.json()['response'], flags=re.DOTALL)
   return response.json()['response']

def call_llm(prompt):
      url = "https://openrouter.ai/api/v1/chat/completions"
      headers = {
         "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
         "Content-Type": "application/json"
      }
      payload = {
         "model": "deepseek/deepseek-r1-distill-llama-70b:free",  # example open‑source model 
         "messages": [{"role": "user", "content": prompt + " Change the language to English. Make sure to use the IEEE format."}],
         "temperature": 0.7,
         "stream": False
      }

      resp = requests.post(url, json=payload, headers=headers)
      resp.raise_for_status()
      data = resp.json()
      # identical shape to OpenAI’s response
      return data["choices"][0]["message"]["content"]
if __name__ == "__main__":
    with open ("document.txt", "r") as f:
        text = f.read()
    prompt = f"Generate a proper IEEE research paper in on the following documentation. Return the output in LaTeX format. Documentation : {text}"
    response = test_call_llm(prompt)
    cleaned_response = re.sub(r"<think>.*?</think>", "", response, flags=re.DOTALL)
    print(cleaned_response)
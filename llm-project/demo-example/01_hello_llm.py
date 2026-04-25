
import os
from  openai import OpenAI
from dotenv import load_dotenv

# https://hf-mirror.com 修改模型源
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"

load_dotenv()


messages = [
    {"role": "user", "content": "请用 3 句话解释什么是大模型。"},
]

client = OpenAI(
    base_url=os.getenv("OPENAI_BASE_URL"),
    api_key=os.getenv("OPENAI_API_KEY")
)

chat_response = client.chat.completions.create(
    model=os.getenv("OPENAI_MODEL"),
    messages=messages,
)
print("Chat response:", chat_response.choices[0].message.content)
print(chat_response.id)

import os
from  openai import OpenAI
from dotenv import load_dotenv

# https://hf-mirror.com 修改模型源
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"

load_dotenv()

messages = [
    {"role": "system", "content": "你是一名 AI 教学助理，请给前端工程师做解释"},
]

client = OpenAI(
    base_url=os.getenv("OPENAI_BASE_URL"),
    api_key=os.getenv("OPENAI_API_KEY")
)

messages.append({"role": "user", "content": "什么是 embedding？请用简洁例子说明。"})

chat_response = client.chat.completions.create(
    model=os.getenv("OPENAI_MODEL"),
    messages=messages,
)


print(chat_response.choices[0].message.content)
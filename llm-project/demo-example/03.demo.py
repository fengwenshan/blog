import os
from  openai import OpenAI
from dotenv import load_dotenv

# https://hf-mirror.com 修改模型源
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"

load_dotenv()

class ChatService:
    def __init__(self):
        self.model = os.getenv("OPENAI_MODEL")
        self.client = OpenAI(
            base_url=os.getenv("OPENAI_BASE_URL"),
            api_key=os.getenv("OPENAI_API_KEY")
        )
    def ask(self, messages: list[dict], temperature: float = 0.2)  -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
        )
        return response.choices[0].message.content
    # 模型调用失败处理
    def safe_ask(self, messages: list[dict]) -> str:
        try:
            return self.ask(messages)
        except Exception as exc:
            return f"模型调用失败: {exc}"

messages = [
    {"role": "system", "content": "你是一名 AI 架构讲师，回答要分点清晰。"},
    {"role": "user", "content": "请解释 Prompt、RAG、Agent 之间的关系。"},
]
chat_service = ChatService()
print(chat_service.ask(messages))
import asyncio
import atexit

from pocketbase import PocketBase
from dataclasses import dataclass
from typing import Dict, Any, Callable

from pocketbase.models.dtos import RealtimeEvent

@dataclass
class Record:
    collectionId: str
    collectionName: str
    id: str
    updated: str
    created: str

@dataclass
class Test(Record):
    ip: str
    mac: str
    name: str
    region: str
    status: str
    token: str

class DatabaseClient:
    def __init__(self, server_url: str, token: str):
        self.pb = PocketBase(server_url)
        self.token = token
        self.params = {"token": token}

    async def get_test(self) -> Test:
        return Test(
            **(await self.pb.collection("computers").get_first({"params": self.params}))
        )

    async def update_test(self, test_id: str, data: Dict[str, Any]) -> Test:
        return Test(
            **(
                await self.pb.collection("computers").update(
                    test_id, data, {"params": self.params}
                )
            )
        )

    async def subscribe(
        self, callback: Callable[[RealtimeEvent], Any]
    ):
        subscription_params = {
            "headers": {},
            "params": {"token": self.token},
        }

        return await self.pb.collection("computers").subscribe_all(
            callback, subscription_params
        )

async def callback_handler(event: RealtimeEvent):
    print(f"Received event: {event}")


server_url = "http://127.0.0.1:8090"
token = "dYEgcOJiGWuI"
    
db_client = DatabaseClient(server_url, token)

async def main():
    global unsubscribe
    
    test = await db_client.get_test()
    print(f"Test: {test}")
    
    unsubscribe = await db_client.subscribe(callback_handler)
    atexit.register(lambda: asyncio.run(unsubscribe()))
    
    while True:
        await asyncio.sleep(5)


if __name__ == "__main__":
    asyncio.run(main())
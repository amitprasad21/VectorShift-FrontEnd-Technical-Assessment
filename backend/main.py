from collections import deque
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]


class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class PipelinePayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


@app.get('/')
def read_root():
    return {'status': 'healthy'}


@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    nodes = payload.nodes
    edges = payload.edges
    num_nodes = len(nodes)
    num_edges = len(edges)

    if num_nodes == 0:
        return {'num_nodes': 0, 'num_edges': 0, 'is_dag': True}

    adj_list = {node.id: [] for node in nodes}
    in_degree = {node.id: 0 for node in nodes}

    for edge in edges:
        if edge.source in adj_list and edge.target in in_degree:
            adj_list[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    queue = deque(nid for nid, deg in in_degree.items() if deg == 0)
    processed = 0

    while queue:
        curr = queue.popleft()
        processed += 1
        for neighbor in adj_list.get(curr, []):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': processed == num_nodes,
    }

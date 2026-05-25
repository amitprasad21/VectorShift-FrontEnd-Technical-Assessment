from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_empty_pipeline():
    r = client.post("/pipelines/parse", json={"nodes": [], "edges": []})
    assert r.status_code == 200
    assert r.json() == {"num_nodes": 0, "num_edges": 0, "is_dag": True}


def test_simple_dag():
    payload = {
        "nodes": [
            {"id": "a", "type": "input", "data": {}},
            {"id": "b", "type": "llm", "data": {}},
            {"id": "c", "type": "output", "data": {}},
        ],
        "edges": [
            {"id": "e1", "source": "a", "target": "b", "sourceHandle": "out", "targetHandle": "in"},
            {"id": "e2", "source": "b", "target": "c", "sourceHandle": "out", "targetHandle": "in"},
        ],
    }
    r = client.post("/pipelines/parse", json=payload)
    data = r.json()
    assert data["num_nodes"] == 3
    assert data["num_edges"] == 2
    assert data["is_dag"] is True


def test_cycle_detection():
    payload = {
        "nodes": [
            {"id": "a", "type": "input", "data": {}},
            {"id": "b", "type": "llm", "data": {}},
        ],
        "edges": [
            {"id": "e1", "source": "a", "target": "b", "sourceHandle": "out", "targetHandle": "in"},
            {"id": "e2", "source": "b", "target": "a", "sourceHandle": "out", "targetHandle": "in"},
        ],
    }
    r = client.post("/pipelines/parse", json=payload)
    assert r.json()["is_dag"] is False


def test_null_handles_accepted():
    payload = {
        "nodes": [{"id": "a", "type": "input", "data": {}}, {"id": "b", "type": "output", "data": {}}],
        "edges": [{"id": "e1", "source": "a", "target": "b"}],
    }
    r = client.post("/pipelines/parse", json=payload)
    assert r.status_code == 200
    assert r.json()["is_dag"] is True


def test_self_loop():
    payload = {
        "nodes": [{"id": "a", "type": "input", "data": {}}],
        "edges": [{"id": "e1", "source": "a", "target": "a", "sourceHandle": "out", "targetHandle": "in"}],
    }
    r = client.post("/pipelines/parse", json=payload)
    assert r.json()["is_dag"] is False

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict
import uvicorn
import uuid
import logging
from pydantic import BaseModel

# Add logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080", "null"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active games
games: Dict[str, dict] = {}

def check_winner(move1: str, move2: str) -> str:
    valid_moves = ['rock', 'paper', 'scissors']
    if move1 not in valid_moves or move2 not in valid_moves:
        raise HTTPException(status_code=400, detail="Invalid move. Use: rock, paper, or scissors")
    
    if move1 == move2:
        return "tie"
    
    winning_moves = {
        'rock': 'scissors',
        'scissors': 'paper',
        'paper': 'rock'
    }
    
    if winning_moves[move1] == move2:
        return "player1"
    return "player2"

# Request/Response Models
class CreateGameRequest(BaseModel):
    player1: str
    player2: str

class JoinGameRequest(BaseModel):
    playerName: str

class MoveRequest(BaseModel):
    move: str

class GameResponse(BaseModel):
    gameId: str

class GameStatusResponse(BaseModel):
    status: str
    winner: Optional[str] = None
    player1: str
    player2: Optional[str] = None
    move1: Optional[str] = None
    move2: Optional[str] = None

@app.post("/game/new")
def create_game(game_request: CreateGameRequest):
    game_id = str(uuid.uuid4())
    games[game_id] = {
        "player1": game_request.player1,
        "player2": game_request.player2,
        "move1": None,
        "move2": None,
        "status": "active",
        "winner": None
    }
    return {"game_id": game_id}

@app.post("/game/{game_id}/join")
async def join_game(game_id: str, request: JoinGameRequest):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    if games[game_id]["player2"]:
        raise HTTPException(status_code=400, detail="Game is full")
    
    games[game_id]["player2"] = request.playerName
    games[game_id]["status"] = "playing"
    return {"message": "Joined game successfully"}

@app.post("/game/{game_id}/move")
async def make_move(game_id: str, request: MoveRequest):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    if game["move1"] is None:
        game["move1"] = request.move
    elif game["move2"] is None:
        game["move2"] = request.move
        winner = check_winner(game["move1"], game["move2"])
        game["status"] = "completed"
        game["winner"] = winner
    else:
        raise HTTPException(status_code=400, detail="Both moves already made")
    
    return {"message": "Move recorded successfully"}

@app.get("/game/{game_id}")
async def get_game_status(game_id: str):
    logger.info(f"Getting status for game: {game_id}")
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    return GameStatusResponse(**games[game_id])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)




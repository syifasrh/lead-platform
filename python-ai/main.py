from fastapi import FastAPI
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = FastAPI()
vader_analyzer = SentimentIntensityAnalyzer()

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str

@app.post("/sentiment", response_model=SentimentResponse)
def analyze_sentiment(payload: SentimentRequest):
    text = payload.text.lower()

    positive_keywords = [
        # High Interest & Intent
        "interested", "very interested", "extremely interested", "highly interested",
        "want to know more", "tell me more", "share more details", "send information",
        "looking for", "searching for", "seeking", "need", "require", "must have",
        "ready to buy", "ready to purchase", "want to order", "place order",

        # Strong Positive Signals
        "excited", "thrilled", "eager", "enthusiastic", "passionate",
        "great", "excellent", "fantastic", "amazing", "wonderful", "outstanding",
        "perfect", "ideal", "exactly what", "just what", "precisely what",
        "impressive", "remarkable", "superb", "brilliant", "phenomenal",
        "sounds good", "sounds great", "sounds perfect", "looks good",
        "love this", "love it", "absolutely love", "this is what", "glad",

        # Decision-making & Commitment
        "let's schedule", "let's meet", "let's discuss", "let's talk",
        "call me", "contact me", "reach out", "get in touch",
        "sign me up", "count me in", "i'm in", "let's do it", "let's proceed",
        "send proposal", "send quote", "send pricing", "send contract",
        "budget approved", "funds available", "ready to invest", "authorized to proceed",
        "move forward", "next steps", "when can we start", "how soon",

        # Urgency & Priority
        "urgent", "asap", "immediately", "right away", "as soon as possible",
        "priority", "top priority", "high priority", "time-sensitive",
        "deadline approaching", "need quickly", "need now",

        # Positive Feedback
        "recommend", "highly recommend", "best", "top choice", "first choice",
        "trusted", "reliable", "proven", "successful", "effective",
        "satisfied", "happy", "pleased", "delighted", "impressed",

        # Indonesian - Expanded
        "tertarik", "sangat tertarik", "amat tertarik", "berminat", "minat tinggi",
        "butuh", "perlu", "memerlukan", "diperlukan", "dibutuhkan",
        "cocok", "pas", "sesuai", "tepat", "klop",
        "bagus", "baik", "hebat", "mantap", "keren", "top",
        "setuju", "sepakat", "deal", "oke", "ok", "siap", "lanjut", "gas",
        "mau", "ingin", "pengen", "kepingin", "berharap",
        "cepat", "segera", "langsung", "secepatnya",
        "puas", "senang", "suka", "terkesan", "recommended"
    ]

    negative_keywords = [
        # Strong Rejection
        "not interested", "no interest", "zero interest", "completely uninterested",
        "no thanks", "no thank you", "not for me", "pass", "decline",
        "not right now", "not at this time", "maybe later", "some other time",
        "not looking", "don't need", "do not need", "doesn't fit", "not a fit",
        "already have", "already got", "already using", "current solution",
        "not a priority", "low priority", "not important", "not urgent",
        "not recommended", "don't recommend", "do not recommend", "wouldn't recommend",
        "not good", "not great", "not satisfied", "not happy", "not pleased",
        "not impressed", "not convinced", "not ideal", "not perfect",

        # Budget & Cost Issues
        "too expensive", "too costly", "too pricey", "overpriced", "too much",
        "can't afford", "cannot afford", "out of budget", "over budget",
        "no budget", "budget constraints", "budget issues", "cost prohibitive",
        "cheaper option", "looking for cheaper", "too high", "price too high",

        # Negative Feedback
        "waste of time", "wasting time", "time waster", "not worth it",
        "not convinced", "unconvinced", "skeptical", "doubtful", "unsure",
        "disappointed", "underwhelmed", "unimpressed", "not satisfied",
        "confused", "unclear", "don't understand", "doesn't make sense",
        "poor", "bad", "terrible", "awful", "horrible", "worst",
        "unreliable", "untrustworthy", "questionable", "suspicious",

        # Delays & Objections
        "call back later", "contact later", "follow up later", "reach back",
        "still thinking", "need to think", "thinking about it", "considering",
        "need to discuss", "need approval", "need permission", "need buy-in",
        "not sure", "uncertain", "undecided", "on the fence",
        "hesitant", "reluctant", "reserved", "cautious",
        "concerned", "worried", "nervous", "anxious", "uncomfortable",
        "need more time", "need more info", "need details", "more information",

        # Competitive Issues
        "competitor", "competition", "comparing", "looking at others",
        "other options", "other vendors", "other solutions",
        "better deal", "better offer", "better price elsewhere",

        # Problems & Issues
        "problem", "issue", "concern", "trouble", "difficulty",
        "doesn't work", "not working", "broken", "failed", "error",
        "complicated", "complex", "difficult", "hard", "confusing",
        "missing features", "lack of", "insufficient", "inadequate",

        # Indonesian - Expanded
        "tidak tertarik", "nggak tertarik", "ga minat", "tidak berminat",
        "nanti saja", "nanti dulu", "lain kali", "kapan-kapan",
        "mahal", "kemahalan", "terlalu mahal", "harga tinggi", "overprice",
        "sudah ada", "sudah punya", "udah ada", "udah punya",
        "pikir-pikir", "dipikir dulu", "pertimbangkan dulu", "mikir dulu",
        "belum butuh", "belum perlu", "ga perlu", "tidak perlu",
        "belum siap", "belum ready", "ga siap", "tidak siap",
        "batal", "cancel", "batalkan", "gajadi", "ga jadi",
        "ragu", "kurang yakin", "tidak yakin", "bingung", "rancu",
        "ribet", "rumit", "susah", "sulit", "repot",
        "kecewa", "mengecewakan", "zonk", "jelek", "buruk",
        "tunggu", "nunggu", "pending", "tunda", "ditunda"
    ]

    keyword_sentiment = "neutral"
    negative_score = sum(1 for keyword in negative_keywords if keyword in text)
    positive_score = sum(1 for keyword in positive_keywords if keyword in text)

    if negative_score > 0:
        keyword_sentiment = "negative"
    elif positive_score > 0:
        keyword_sentiment = "positive"

    vader_scores = vader_analyzer.polarity_scores(text)
    compound_score = vader_scores['compound']

    vader_sentiment = "neutral"
    if compound_score >= 0.05:
        vader_sentiment = "positive"
    elif compound_score <= -0.05:
        vader_sentiment = "negative"

    if keyword_sentiment != "neutral":
        final_sentiment = keyword_sentiment
    else:
        final_sentiment = vader_sentiment

    return SentimentResponse(sentiment=final_sentiment)

"""OpenAI embedding wrapper using text-embedding-3-small."""

from openai import OpenAI

from deviq_graphrag.config import settings

EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIM = 1536
MAX_BATCH_SIZE = 100


def _get_client() -> OpenAI:
    return OpenAI(api_key=settings.openai_api_key)


def embed_text(text: str) -> list[float]:
    """Embed a single text string.

    Args:
        text: The input text to embed.

    Returns:
        Embedding vector as a list of floats.
    """
    client = _get_client()
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding


def embed_batch(texts: list[str]) -> list[list[float]]:
    """Embed a batch of texts.

    Splits into chunks of MAX_BATCH_SIZE to stay within API limits.

    Args:
        texts: List of input strings.

    Returns:
        List of embedding vectors, one per input text.
    """
    client = _get_client()
    all_embeddings: list[list[float]] = []

    for i in range(0, len(texts), MAX_BATCH_SIZE):
        batch = texts[i : i + MAX_BATCH_SIZE]
        response = client.embeddings.create(model=EMBEDDING_MODEL, input=batch)
        # Sort by index to preserve order
        sorted_data = sorted(response.data, key=lambda x: x.index)
        all_embeddings.extend([d.embedding for d in sorted_data])

    return all_embeddings

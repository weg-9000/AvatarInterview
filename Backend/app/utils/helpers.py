import json
import re
import uuid
from datetime import datetime
from typing import Dict, List, Any

def generate_unique_id() -> str:
    """고유 ID 생성"""
    return str(uuid.uuid4())

def format_datetime(dt: datetime) -> str:
    """날짜 시간 포맷팅"""
    return dt.isoformat()

def parse_json_safely(json_str: str) -> Dict:
    """안전하게 JSON 파싱"""
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return {}

def extract_keywords(text: str) -> List[str]:
    """텍스트에서 키워드 추출"""
    # 간단한 구현: 단어 빈도 기반 키워드 추출
    words = re.findall(r'\b\w+\b', text.lower())
    word_freq = {}
    
    for word in words:
        if len(word) > 3:  # 3글자 이상 단어만 고려
            word_freq[word] = word_freq.get(word, 0) + 1
    
    # 빈도 기준 상위 10개 단어 반환
    keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
    return [word for word, _ in keywords]

def sanitize_html(html: str) -> str:
    """HTML 태그 제거"""
    return re.sub(r'<[^>]*>', '', html)

def truncate_text(text: str, max_length: int = 100) -> str:
    """텍스트 길이 제한"""
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."

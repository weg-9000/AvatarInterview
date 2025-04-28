from datetime import datetime

async def process_resume_data(resume_data):
    """
    사용자가 입력한 이력서 데이터를 처리하는 함수
    """
    current_time = datetime.now().isoformat()
    processed_data = {
        "resumeContent": resume_data, 
        "uploadedAt": current_time,
        "processedAt": current_time
    }
    return processed_data
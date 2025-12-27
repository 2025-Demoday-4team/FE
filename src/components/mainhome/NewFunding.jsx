import React, { useState } from 'react'
import '../../assets/sass/section/mainhome/newfunding.scss'
import Nav from '../Nav'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import image_placeholder from '../../assets/img/image_placeholder.png'

const NewFunding = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadlineAt, setDeadlineAt] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [previewFile, setPreviewFile] = useState('');

    const isValid = title.trim() !== '' && Number(targetAmount) >= 10000 && deadlineAt !== '' && imageFile !== null;

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewFile(url);
        }
    };
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('giftImage', imageFile);
        formData.append('title', title);
        formData.append('targetAmount', Number(targetAmount));
        formData.append('deadlineAt', `${deadlineAt}T00:00:00`);

        if (!isValid) {
            alert('모든 정보를 입력해주세요. (금액은 10,000원 이상부터 가능)');
            return;
        }

        try {
            const response = await axios.post('http://solserver.store/api/v1/fundings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', //이미지 전송 
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}` //로그인 토큰
                }
            });
            if (response.status >= 200 && response.status < 300) {
                alert('펀딩이 생성되었습니다.');
                console.log('✅ navigate 호출 직전');
                navigate('/myfunding');
                console.log('✅ navigate 호출 직후');

            }
        } catch (error) {
            console.log('펀딩 생성 실패', error);
        }


    }
    return (
        <div className="container newfunding_wrap">
            <div className="header">
                <h1>새 펀딩 만들기</h1>
                <p>어떤 선물을 원하시나요? 펀딩을 만들어보세요!</p>
            </div>
            <div className="main">
                <div className="top">
                    {previewFile ? (
                        <img src={previewFile} alt="사진 미리보기" />
                    ) : (
                        <div className="placeholder">
                            <img id='camera' src={image_placeholder} alt="카메라 아이콘" />
                            <p>선물 이미지 추가</p>
                        </div>
                    )}
                    <input id="image_input" type="file" onChange={handleImage} accept="image/*" />
                </div>
                <div className="bottom">
                    <div className="box">
                        <h2>펀딩 제목</h2>
                        <input type="text" placeholder="제목을 입력해주세요." value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="box" id='box2'>
                        <h2>목표 금액</h2>
                        <input type="number" placeholder="금액을 입력해주세요." value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
                        <p>최소 10000원부터 설정할 수 있어요.</p>
                    </div>
                    <div className="box" id='box3'>
                        <h2>펀딩 마감일</h2>
                        <input type="date" placeholder="마감일을 입력해주세요." value={deadlineAt} onChange={(e) => setDeadlineAt(e.target.value)} />
                    </div>
                </div>
                <button onClick={handleSubmit} className={isValid ? 'active' : ''}>완료</button>
            </div>
            <Nav />
        </div>
    )
}

export default NewFunding
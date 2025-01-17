import { Buttons } from '@/constants/ButtonList';
import { useState } from 'react';
import styled from 'styled-components';

interface BtnProps {
	id: string;
	onClick?: () => void;
}

interface BtnWrapperProps {
	$bordercolor: string;
	$backgroundcolor: string;
}

function Btn({ id, onClick }: BtnProps) {
	const button = Buttons.find((button) => button.id === id);
	const [clicked, setClicked] = useState(false);

	if (!button) {
		console.log('constants/ButtonList에서 지정한 id값을 넘겨주세요');
		return null;
	}

	const { text, color, bordercolor, backgroundcolor } = button;

	const handleClick = () => {
		setClicked(!clicked);
		if (onClick) {
			onClick();
		}
	};

	return (
		<BtnWrapper
			id={id}
			onClick={handleClick}
			$bordercolor={bordercolor}
			$backgroundcolor={clicked ? 'orange1' : backgroundcolor}
		>
			<BtnName color={clicked ? 'white1' : color}>{text}</BtnName>
		</BtnWrapper>
	);
}

export default Btn;

const BtnWrapper = styled.button<BtnWrapperProps>`
	cursor: pointer;
	z-index: 1;
	width: 20.2rem;
	height: 4.8rem;
	border-radius: 15px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 3px solid ${({ theme, $bordercolor }) => theme.colors[$bordercolor]};
	background-color: ${({ theme, $backgroundcolor }) => theme.colors[$backgroundcolor]};
	box-shadow: ${({ id }) =>
		id === 'aiClassify' ? '0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset' : 'none'};
`;

const BtnName = styled.p<{ color: string }>`
	${({ theme }) => theme.fonts.Pretendard_Medium_18px};
	color: ${({ theme, color }) => theme.colors[color]};
`;

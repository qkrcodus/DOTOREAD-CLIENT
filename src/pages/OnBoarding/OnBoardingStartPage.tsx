import Button from './components/OnBoardingStartPage/Button';
import LogoIcon from '@/assets/LogoOnBoarding.svg?react';
import OnBoardingStart from '@/assets/OnBoardingStart.svg?react';
import styled from 'styled-components';

function OnBoardingStartPage() {
	return (
		<OnBoardingStartPageWrapper>
			<LogoWrapper>
				<LogoIcon />
			</LogoWrapper>
			<ContentWrapper>
				<TextTitle>DOTOREAD</TextTitle>
				<SubDescription>
					북마크의 모든 것,
					<br />
					지금 바로 도토릿에서 해결하세요
				</SubDescription>
				<Button />
			</ContentWrapper>
			<OnBoardingStartWrapper>
				<OnBoardingStart />
			</OnBoardingStartWrapper>
		</OnBoardingStartPageWrapper>
	);
}

export default OnBoardingStartPage;

const OnBoardingStartPageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100vh;
	background-color: ${({ theme }) => theme.colors.background};
`;

const LogoWrapper = styled.div`
	position: absolute;
	top: 5.539rem;
	left: 10.9rem;
`;

const ContentWrapper = styled.div`
	position: absolute;
	top: 38.6rem;
	left: 26.6rem;
	display: flex;
	gap: 2.1rem;
	flex-direction: column;
	align-items: flex-start;
`;
const OnBoardingStartWrapper = styled.div`
	position: absolute;
	right: 0;
`;
const TextTitle = styled.div`
	${({ theme }) => theme.fonts.Pretendard_Semibold_45px};
	color: ${({ theme }) => theme.colors.orange1};
`;

const SubDescription = styled.div`
	${({ theme }) => theme.fonts.Pretendard_Semibold_45px};
	color: ${({ theme }) => theme.colors.white1};
`;

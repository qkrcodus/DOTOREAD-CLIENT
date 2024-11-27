import Classified from '@/assets/Classified.svg?react';
import EveryBookMark from '@/assets/EveryBookMark.svg?react';
import Unclassified from '@/assets/Unclassified.svg?react';
import Btn from '@/components/common/Button/Btn';
import SortBtn from '@/components/common/Button/SortBtn';
import { useAiClassificationContext } from '@/contexts/AiClassificationContext';
import { useBookmarkContext } from '@/contexts/BookmarkContext';
import BookMarkList from '@/pages/BookMark/BookMarkList';
import Navbar from '@/pages/BookMark/Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface TitleProps {
	text: string;
	Icon: React.ElementType;
}

function Title({ text, Icon }: TitleProps) {
	return (
		<TitleWrapper>
			{Icon && <Icon />}
			<Category>{text}</Category>
		</TitleWrapper>
	);
}

function BookMarkPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { bookmarks, fetchBookmarks } = useBookmarkContext();
	const { text, iconType, category } = location.state || { text: '', iconType: '', category: '' };
	const Icon = iconType === 'everyBookmark' ? EveryBookMark : iconType === 'unclassified' ? Unclassified : Classified;

	useEffect(() => {
		const fetchData = async () => {
			if (category === '모든 북마크') {
				await fetchBookmarks('/api/v1/bookmarks/all?sortType=DESC');
			} else if (category === '미분류') {
				await fetchBookmarks('/api/v1/bookmarks/uncategorized?sortType=DESC');
			} else if (iconType === 'classified') {
				await fetchBookmarks(`/api/v1/bookmarks/all/${category}?sortType=DESC`);
			}
		};

		fetchData();
	}, [category, iconType]);

	const [isAiClassifyActive, setAiClassifyActive] = useState(false);
	const [isAllSelected, setAllSelected] = useState(false);
	const [hasSelectedItems, setHasSelectedItems] = useState(false);
	const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
	const { setClassifiedData } = useAiClassificationContext();

	const handleAiClassifyBtn = () => {
		setAiClassifyActive(!isAiClassifyActive);
		setAllSelected(false);
		setHasSelectedItems(false);
	};

	const handleChooseAllBtn = () => {
		const newSelectionState = !isAllSelected;
		setAllSelected(newSelectionState);
		setHasSelectedItems(newSelectionState);
		if (newSelectionState) {
			setSelectedBookmarks(bookmarks.map((bookmark) => bookmark.id));
		} else {
			setSelectedBookmarks([]);
		}
	};

	const handleAiClassify = async () => {
		try {
			const accessToken = localStorage.getItem('access-token');
			if (!accessToken) {
				console.error('Access token not found');
				return;
			}

			const userId = parseInt(accessToken);
			if (selectedBookmarks.length === 0) {
				console.warn('No bookmarks selected for classification');
				return;
			}

			const response = await axios.post(
				`${BASE_URL}/api/v1/classify/ai`,
				{
					bookmarkIds: selectedBookmarks,
					userId,
				},
				{
					headers: {
						access: `${accessToken}`,
					},
				},
			);

			console.log('AI classification response:', response.data);
			setClassifiedData(response.data.result);
			navigate('/ai');
		} catch (error) {
			console.error('Error classifying bookmarks with AI', error);
		}
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && hasSelectedItems) {
				handleAiClassify();
			}
		};

		if (isAiClassifyActive) {
			window.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isAiClassifyActive, hasSelectedItems, selectedBookmarks]);

	useEffect(() => {
		return () => {
			setAiClassifyActive(false);
			setAllSelected(false);
			setHasSelectedItems(false);
		};
	}, [location]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	return (
		<BookMarkPageWrapper>
			<BackgroundBox>
				<Title text={text} Icon={Icon} />
				{category === '미분류' && (
					<BtnWrapperForAiClassify onClick={handleAiClassifyBtn}>
						<Btn id="aiClassify" />
					</BtnWrapperForAiClassify>
				)}
				{isAiClassifyActive && (
					<BtnWrapperForChooseAll onClick={handleChooseAllBtn}>
						<Btn id="chooseAll" />
					</BtnWrapperForChooseAll>
				)}
				<SortBtnWrapper>
					<SortBtn />
				</SortBtnWrapper>
				{!isAiClassifyActive && <Navbar />}
				<BookMarkList
					iconType={iconType}
					category={category}
					bookmarks={bookmarks}
					isSelectable={isAiClassifyActive}
					isAllSelected={isAllSelected}
					setHasSelectedItems={setHasSelectedItems}
					selectedBookmarks={selectedBookmarks}
					setSelectedBookmarks={setSelectedBookmarks}
				/>
			</BackgroundBox>
		</BookMarkPageWrapper>
	);
}

export default BookMarkPage;

const BookMarkPageWrapper = styled.div`
	background-color: ${({ theme }) => theme.colors.background};
	max-width: 100vw;
	min-height: 100vh;
`;

const BackgroundBox = styled.div`
	width: 134.6rem;
	height: 92.9rem;
	border-radius: 20px;
	background: ${({ theme }) => theme.colors.background_box};
	position: fixed;
	left: 44.2rem;
	overflow: auto;
`;

const TitleWrapper = styled.div`
	position: absolute;
	left: 2.8rem;
	top: 2rem;
	display: flex;
	gap: 1rem;
	align-items: center;
`;

const BtnWrapperForAiClassify = styled.div`
	position: absolute;
	top: 3.7rem;
	left: 97.3rem;
	z-index: 10000;
`;

const BtnWrapperForChooseAll = styled.div`
	position: absolute;
	top: 3.7rem;
	left: 76.3rem;
	z-index: 10000;
`;

const SortBtnWrapper = styled.div`
	position: absolute;
	right: 3.4rem;
	top: 3.7rem;
	z-index: 1;
`;

const Category = styled.p`
	${({ theme }) => theme.fonts.Pretendard_Semibold_38px};
	color: ${({ theme }) => theme.colors.white1};
`;

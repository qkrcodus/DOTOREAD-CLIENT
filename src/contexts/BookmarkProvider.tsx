import { BookmarkContext } from './BookmarkContext';
import { ListItem, transformApiResponseToItems } from '@/constants/ListItems';
import axios from 'axios';
import { ReactNode, useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
	const [bookmarks, setBookmarks] = useState<ListItem[]>([]);

	const fetchBookmarks = async (endpoint: string) => {
		try {
			const accessToken = localStorage.getItem('access-token');
			const response = await axios.get(`${BASE_URL}${endpoint}`, {
				headers: { access: `${accessToken}` },
			});
			if (response.data.isSuccess) {
				const bookmarks = transformApiResponseToItems(response.data.result);
				setBookmarks(bookmarks);
			}
		} catch (error) {
			console.error('북마크를 가져오는 중 오류 발생:', error);
		}
	};

	const addBookmark = async (url: string) => {
		try {
			const accessToken = localStorage.getItem('access-token');
			await axios.post(
				`${BASE_URL}/api/v1/bookmarks`,
				{ url },
				{
					headers: { access: `${accessToken}` },
				},
			);

			// 북마크 추가 후 fetchBookmarks 호출하여 최신 북마크 목록을 가져옵니다.
			await fetchBookmarks('/api/v1/bookmarks/all?sortType=DESC');
		} catch (error) {
			console.error('북마크 추가 중 오류 발생:', error);
		}
	};

	return (
		<BookmarkContext.Provider value={{ bookmarks, fetchBookmarks, addBookmark }}>{children}</BookmarkContext.Provider>
	);
};

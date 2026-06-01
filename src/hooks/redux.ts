import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux'; // <-- এখানে type যুক্ত করা হয়েছে
import type { RootState, AppDispatch } from '../store/store'; // <-- এখানে type যুক্ত করা হয়েছে

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
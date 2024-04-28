import { useRef } from 'react';
import styled from 'styled-components';
import CommentItem from '@/components/common/modal/card-detail/CommentItem';
import InvitedDashBoardListLoader from '@/components/dashboard/my-board/InvitedDashBoardListLoader';
import useCommentsListQuery from '@/hooks/query/comments/useCommentsListQuery';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const S = {
  CommentListContainer: styled.div`
    overflow: auto;
    height: 11rem;
    margin-top: 3rem;

    border: 1px solid ${({ theme }) => theme.color.grayLight};
    border-radius: 0.5rem;
    &::-webkit-scrollbar {
      width: 1rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.color.grayLight};
      border-radius: 1rem;
      background-clip: padding-box;
      border: 2px solid transparent;
    }
    &::-webkit-scrollbar-track {
      background-color: ${({ theme }) => theme.color.white};
      border-radius: 1rem;
      box-shadow: inset 0px 0px 5px white;
    }
  `,
};

interface CommentItemDataProps {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  cardId: number;
  author: {
    profileImageUrl: string;
    nickname: string;
    id: number;
  };
}
function CommentList({ card_Id }) {
  const loaderRef = useRef();

  const { data, fetchNextPage } = useCommentsListQuery({ cardId: card_Id });

  const isLastPage = data?.pages?.at(-1)?.cursorId === null;

  // const pages = data?.pages;
  // console.log('bbbb', pages);

  useIntersectionObserver(async () => {
    await fetchNextPage();
  }, loaderRef);

  return (
    <S.CommentListContainer>
      {data?.pages.map((page) =>
        page.comments.map((comment: CommentItemDataProps) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            cardId={comment.cardId}
            author={comment.author}
            content={comment.content}
            createdAt={comment.createdAt}
            updatedAt={comment.updatedAt}
          />
        )),
      )}
      <InvitedDashBoardListLoader
        loaderRef={loaderRef}
        style={isLastPage ? { display: 'none' } : { marginTop: '2rem' }}
      />
    </S.CommentListContainer>
  );
}
export default CommentList;

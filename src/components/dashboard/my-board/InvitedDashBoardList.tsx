import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InvitedDashBoardListLoader from './InvitedDashBoardListLoader';
import { styled } from 'styled-components';
import Button from '@/components/common/button/Button';
import NoInvitation from '@/components/dashboard/my-board/NoInvitation';
import SearchBar from '@/components/dashboard/my-board/SearchBar';
import useAcceptInvitationMutation from '@/hooks/query/dashboards/useAcceptInvitationMutation';
import useMyInvitationListQuery from '@/hooks/query/dashboards/useMyInvitationListQuery';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { BUTTON_TYPE } from '@/constants/BUTTON_TYPE';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';

const S = {
  Container: styled.div`
    min-height: 40rem;
    margin-top: 4rem;
    border-radius: 0.8rem;
    box-shadow: rgba(0, 0, 0, 0.08) 0 1.2rem 2rem 0;
    background-color: ${({ theme }) => theme.color.white};

    ${MEDIA_QUERIES.onMobile} {
      margin-top: 2.4rem;
    }
  `,

  Title: styled.h2`
    padding: 3.2rem 2.8rem 0;
    font-size: 2.4rem;
    font-weight: 700;

    ${MEDIA_QUERIES.onMobile} {
      padding: 2.4rem 1.6rem 0;
      font-size: 2rem;
    }
  `,

  SearchBarWrapper: styled.div`
    padding: 2.4rem;
  `,

  NoResult: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10rem;

    & span {
      color: ${({ theme }) => theme.color.main};
    }
  `,

  Invitations: styled.ul``,

  InvitationTabBar: styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 6rem 0.4rem 5rem;
    color: ${({ theme }) => theme.color.gray};

    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,

  Invitation: styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 2.6rem 6rem;
    border-bottom: ${({ theme }) => theme.border.lightGray};

    ${MEDIA_QUERIES.onTablet} {
      gap: 4rem;
    }
    ${MEDIA_QUERIES.onMobile} {
      flex-direction: column;
      justify-content: initial;
      align-items: initial;
      gap: 1rem;
      padding: 1.6rem;
    }
  `,

  TitleAndInviter: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    gap: 6rem;
    font-size: 1.6rem;

    ${MEDIA_QUERIES.onMobile} {
      flex-direction: column;
      justify-content: initial;
      align-items: initial;
      gap: 1rem;

      font-size: 1.4rem;
    }
  `,

  BoardTitle: styled.div`
    min-width: 14rem;

    ${MEDIA_QUERIES.onMobile} {
      &::before {
        content: '이름';
        padding-right: 1rem;
        color: ${({ theme }) => theme.color.gray};
      }
    }
  `,

  Inviter: styled.div`
    white-space: nowrap;
    padding-right: 1rem;

    ${MEDIA_QUERIES.onMobile} {
      &::before {
        content: '초대자';
        padding-right: 1rem;
        color: ${({ theme }) => theme.color.gray};
      }
    }
  `,

  ButtonContainer: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    ${MEDIA_QUERIES.onMobile} {
      justify-content: space-between;
      width: 100%;

      button {
        width: 100%;
      }
    }
  `,
};

function InvitedDashBoardList() {
  const loaderRef = useRef();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword'));

  const { data: invitationData, fetchNextPage } = useMyInvitationListQuery();
  const isLastPage = invitationData?.pages?.at(-1)?.cursorId === null;

  useIntersectionObserver(async () => {
    await fetchNextPage();
  }, loaderRef);

  useEffect(() => {
    setKeyword(searchParams.get('keyword'));
  }, [searchParams]);
  const { mutate: responseInvitationMutate } = useAcceptInvitationMutation();

  const handleAcceptButtonClick = (invitationId: number) => {
    responseInvitationMutate({
      invitationId: invitationId,
      inviteAccepted: true,
    });
  };

  const handleRejectButtonClick = (invitationId: number) => {
    const confirmReject = window.confirm('정말 초대를 거절하시겠어요?🥹'); // 나중에 모달 대체로
    if (confirmReject) {
      responseInvitationMutate({
        invitationId: invitationId,
        inviteAccepted: false,
      });
    }
  };

  const filteredInvitations = keyword
    ? invitationData?.pages.flatMap((page) =>
        page.invitations.filter((invitation) =>
          invitation.dashboard.title
            .toLowerCase()
            .includes(keyword.toLowerCase()),
        ),
      )
    : invitationData?.pages.flatMap((page) => page.invitations);

  const hasSearchResult = filteredInvitations?.length !== 0;
  const isEmptyInvitation = invitationData?.pages[0]?.invitations.length === 0;

  return (
    <S.Container>
      <S.Title>초대받은 대시보드</S.Title>
      {isEmptyInvitation ? (
        <NoInvitation />
      ) : (
        <>
          <S.SearchBarWrapper>
            <SearchBar placeholder="검색" />
          </S.SearchBarWrapper>

          <S.Invitations>
            <S.InvitationTabBar>
              <S.TitleAndInviter>
                <S.BoardTitle>이름</S.BoardTitle>
                <S.Inviter>초대한 사람</S.Inviter>
              </S.TitleAndInviter>
              <div style={{ width: '17.5rem' }}>수락 여부</div>
            </S.InvitationTabBar>
            <>
              {!hasSearchResult && (
                <S.NoResult>
                  '<span>{keyword}</span>'로 검색한 결과가 없습니다😢
                </S.NoResult>
              )}
              {filteredInvitations?.map((invitation) => (
                <S.Invitation key={invitation.id}>
                  <S.TitleAndInviter>
                    <S.BoardTitle>{invitation.dashboard.title}</S.BoardTitle>
                    <S.Inviter>{invitation.inviter.nickname}</S.Inviter>
                  </S.TitleAndInviter>
                  <S.ButtonContainer>
                    <Button
                      size="S"
                      onClick={() => handleAcceptButtonClick(invitation.id)}
                    >
                      수락
                    </Button>
                    <Button
                      size="S"
                      styleType={BUTTON_TYPE.SECONDARY}
                      onClick={() => handleRejectButtonClick(invitation.id)}
                    >
                      거절
                    </Button>
                  </S.ButtonContainer>
                </S.Invitation>
              ))}

              <InvitedDashBoardListLoader
                loaderRef={loaderRef}
                style={isLastPage ? { display: 'none' } : { marginTop: '2rem' }}
              />
            </>
          </S.Invitations>
        </>
      )}
    </S.Container>
  );
}

export default InvitedDashBoardList;

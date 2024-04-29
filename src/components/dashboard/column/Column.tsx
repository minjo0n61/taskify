import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Card from '@/components/common/Card';
import AddIconButton from '@/components/common/button/AddIconButton';
import ColumnsManageModal from '@/components/common/modal/ColumnsManageModal';
import ToDoCreateModal from '@/components/common/modal/ToDoCreateModal';
import CardLoader from '@/components/dashboard/column/CardLoader';
import useCardListQuery from '@/hooks/query/cards/useCardListQuery';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';
import SettingIcon from '@/public/icon/settingIcon.svg';

const S = {
  DashBoardWrapper: styled.div`
    display: flex;

    ${MEDIA_QUERIES.onTablet} {
      display: block;
    }
  `,
  Column: styled.div<ColumnProps>`
    height: calc(100vh - 7rem);
    min-width: 35.4rem;

    overflow-y: scroll;

    border-right: ${({ theme }) => theme.border.lightGray};
    border-bottom: ${({ theme }) => theme.border.lightGray};

    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;

    ${MEDIA_QUERIES.onTablet} {
      width: 100%;
      height: 6rem;
      height: ${({ isExpanded, cardCount }) =>
        /* eslint-disable-next-line */
        isExpanded && cardCount === 0
          ? '12.5rem'
          : isExpanded
            ? 'calc(45.3rem)'
            : '6rem'};

      overflow-y: ${({ isExpanded }) => (isExpanded ? 'scroll' : 'hidden')};

      transition: height 0.3s ease-in-out;
    }
    ${MEDIA_QUERIES.onMobile} {
      width: 100%;
      height: 6rem;

      height: ${({ isExpanded, cardCount }) =>
        /* eslint-disable-next-line */
        isExpanded && cardCount === 0
          ? '12.5rem'
          : isExpanded
            ? 'calc(80rem)'
            : '6rem'};

      min-width: initial;
      overflow-y: ${({ isExpanded }) => (isExpanded ? 'scroll' : 'hidden')};

      transition: height 0.3s ease-in-out;
    }
  `,
  ColumnTopFixedContent: styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: ${({ theme }) => theme.color.background};
    padding: 2rem;
  `,
  ColumnTitleContainer: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  ColumnTitleWrapper: styled.div`
    display: flex;
  `,
  ColumnTitleIconWrapper: styled.div`
    display: flex;
    width: 1.6rem;
    height: 2rem;
    align-items: center;
  `,
  ColumnTitleDotIcon: styled.div`
    background-color: ${({ theme }) => theme.color.main};
    width: 0.8rem;
    height: 0.8rem;
    margin: 0 auto;
    border-radius: 50%;
  `,
  ColumnTitle: styled.div`
    display: flex;
    height: 2rem;
    padding-top: 0.4rem;
    align-items: center;
    font-size: 1.8rem;
    font-weight: 700;
  `,
  ColumnTaskNumber: styled.div`
    display: flex;
    height: 2rem;

    margin-left: 1.2rem;
    padding: 0.3rem 0.6rem 0.1rem;
    background-color: ${({ theme }) => theme.color.grayLight};

    border-radius: 0.4rem;
  `,
  AddButtonTop: styled(AddIconButton)`
    margin: 2.5rem 0rem 0rem;
    width: 100%;

    ${MEDIA_QUERIES.onTablet} {
      display: none;
    }
    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,
  AddButtonContent: styled(AddIconButton)`
    margin: 0.5rem 0rem 0rem;
    width: 100%;
    display: none;

    ${MEDIA_QUERIES.onTablet} {
      display: flex;
    }
    ${MEDIA_QUERIES.onMobile} {
      display: flex;
    }
  `,
  ColumnContentContainer: styled.div`
    display: flex;
    flex-direction: column;
    margin: 0.8rem 0rem 2rem 0rem;
    padding: 0rem 2rem;
    gap: 1.6rem;
  `,
  Scrollbar: styled.div`
    position: absolute;
    right: 0;
    top: 0;
    width: 10px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    cursor: pointer;
  `,
  SettingIcon: styled(SettingIcon)`
    cursor: pointer;
  `,
};

const Column = React.forwardRef(
  (
    {
      title,
      id,
      dashboardId,
    }: { title: string; id: number; dashboardId: number },
    ref,
  ) => {
    const loaderRef = useRef();
    const [isModalOpen1, setModalOpen1] = useState(false);
    const [isModalOpen2, setModalOpen2] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [tempColumnName, setTempColumnName] = useState(title);

    const { data: cards, fetchNextPage } = useCardListQuery({ columnId: id });

    const isLastPage = cards?.pages?.at(-1)?.cursorId === null;

    const cardCount = cards?.pages[0]?.totalCount || 0;

    useIntersectionObserver(async () => {
      await fetchNextPage();
    }, loaderRef);

    const openModal1 = () => setModalOpen1(true);
    const openModal2 = () => setModalOpen2(true);
    const closeModal1 = () => setModalOpen1(false);
    const closeModal2 = () => setModalOpen2(false);

    const toggleHeight = () => {
      setIsExpanded(!isExpanded);
    };

    useIntersectionObserver(async () => {
      await fetchNextPage();
    }, loaderRef);

    return (
      <S.Column ref={ref} isExpanded={isExpanded} cardCount={cardCount}>
        <S.ColumnTopFixedContent onClick={toggleHeight}>
          <S.ColumnTitleContainer>
            <S.ColumnTitleWrapper>
              <S.ColumnTitleIconWrapper>
                <S.ColumnTitleDotIcon />
              </S.ColumnTitleIconWrapper>
              <S.ColumnTitle>{title}</S.ColumnTitle>
              <S.ColumnTaskNumber>{cardCount}</S.ColumnTaskNumber>
            </S.ColumnTitleWrapper>
            <S.SettingIcon onClick={openModal2} />
          </S.ColumnTitleContainer>
          <S.AddButtonTop onClick={openModal1} />
        </S.ColumnTopFixedContent>

        <ToDoCreateModal
          dashboardId={dashboardId}
          columnId={id}
          isOpen={isModalOpen1}
          onClose={closeModal1}
        />
        <ColumnsManageModal
          isOpen={isModalOpen2}
          onClose={closeModal2}
          currentColumnName={tempColumnName}
          columnsId={id}
        />

        <S.ColumnContentContainer>
          <S.AddButtonContent onClick={openModal1} />
          {cards?.pages.map((page) =>
            page.cards.map((card) => (
              <Card key={card.id} data={card} columnTitle={title} />
            )),
          )}
          <CardLoader
            loaderRef={loaderRef}
            style={
              cardCount === 0 || isLastPage
                ? { display: 'none' }
                : { marginTop: '2rem' }
            }
          />
        </S.ColumnContentContainer>
      </S.Column>
    );
  },
);

export default Column;

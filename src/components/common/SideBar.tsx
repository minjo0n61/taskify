import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CircleColor from '@/components/common/CircleColor';
import NewDashBoardModal from '@/components/common/modal/NewDashBoardModal';
import useDashboardListQuery from '@/hooks/query/dashboards/useDashboardListQuery';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';
import AddDashBoardIcon from '@/public/icon/addDashboardBox.svg';
import ArrowLeft from '@/public/icon/arrowLeft.svg';
import ArrowRight from '@/public/icon/arrowRight.svg';
import CreateByMe from '@/public/icon/creatByMe.svg';
import LogoIcon from '@/public/icon/logo.svg';
import LogoText from '@/public/icon/logoText.svg';

const S = {
  SidebarWrapper: styled.div`
    position: fixed;
    top: 0;
    z-index: 99;

    width: 30rem;
    height: 100vh;
    padding: 1.25rem 1.5rem;
    border-right: 1px solid ${({ theme }) => theme.color.grayLight};
    border-top: none;

    background-color: ${({ theme }) => theme.color.white};

    ${MEDIA_QUERIES.onTablet} {
      width: 16rem;
    }

    ${MEDIA_QUERIES.onMobile} {
      width: 6.7rem;
    }
  `,
  Logo: styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 3.75rem;
    cursor: pointer;

    ${MEDIA_QUERIES.onMobile} {
      margin-left: 0.625rem;
    }
  `,
  LogoText: styled(LogoText)`
    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,
  AddDashBoard: styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 2.625rem;
  `,
  AddText: styled.span`
    padding-top: 3%;
    color: ${({ theme }) => theme.color.gray};
    margin-right: 9.5rem;
    margin-left: 0.7rem;
    font-size: 1.2rem;
    font-weight: 700;

    ${MEDIA_QUERIES.onTablet} {
      margin-right: 3.5rem;
      margin-top: 0.45rem;
    }

    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,
  AddDashBoardIcon: styled(AddDashBoardIcon)`
    cursor: pointer;
    margin: 0.2rem 0 0 6rem;

    ${MEDIA_QUERIES.onTablet} {
      margin: 0.2rem 0 0 -0.2rem;
    }

    ${MEDIA_QUERIES.onMobile} {
      margin-left: 0.85rem;
    }
  `,
  DashboardItemWrapper: styled.div<DashboardItemWrapperProps>`
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    width: 27.6rem;
    height: 3.85rem;
    display: inline-block;
    align-items: center;
    margin-top: 0.85rem;
    padding: 1rem 0.5rem 1rem 1rem;
    cursor: pointer;
    border-radius: 0.55rem;
    background: ${({ isActive }) =>
      isActive ? 'var(--violet-violet-8, #f1effd)' : 'transparent'};
    transition: all 0.1s ease-in-out;

    &:hover {
      border-radius: 0.55rem;
      background: var(--violet-violet-8, #f1effd);
      transition: all 0.1s ease-in-out;
    }
    ${MEDIA_QUERIES.onTablet} {
      max-width: 13.4rem;
    }
    ${MEDIA_QUERIES.onMobile} {
      max-width: 3.8rem;
    }
  `,
  CircleColor: styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${MEDIA_QUERIES.onMobile} {
      left: 1rem;
    }
  `,
  DashboardItem: styled.li<{ $active: boolean }>`
    overflow: hidden;
    margin-left: 1.325rem;
    color: ${({ theme }) => theme.color.grayDark};
    font-size: 1.425rem;
    font-weight: 500;
    ${({ $active }) => $active && `font-weight: bold;`}
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;

    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,
  PageNavigationBox: styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(-1rem);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 12rem;
    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,

  PageCount: styled.div`
    display: flex;
    text-align: center;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.color.grayDark};
    ${MEDIA_QUERIES.onMobile} {
      font-size: 1.2rem;
    }
  `,

  Buttons: styled.div`
    display: flex;
  `,

  ArrowButton: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4rem;
    height: 2rem;
    padding: 1.2rem;
    border: ${({ theme }) => theme.border.lightGray};
    background-color: ${({ theme }) => theme.color.white};
  `,
};

interface Dashboard {
  id: any;
  color: string;
  createdByMe: boolean;
  title: string;
}

interface DashboardItemWrapperProps {
  isActive: boolean;
}

function Sidebar() {
  const [isModalOpen6, setModalOpen6] = useState(false);
  const [tempDashBoardName, setTempDashBoardName] = useState(['', '']);
  const openModal6 = () => setModalOpen6(true);
  const closeModal6 = () => setModalOpen6(false);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedDashboardId, setSelectedDashboardId] = useState('');

  const { data } = useDashboardListQuery({
    navigationMethod: 'pagination',
    page,
    size: 8,
  });
  const dashboards = data?.data?.dashboards;

  const totalPages = Math.ceil((data?.data?.totalCount ?? 0) / 8);

  const handlePrevBtnClick = () => {
    setPage((prev) => prev - 1);
  };
  const handleNextBtnClick = () => {
    setPage((prev) => prev + 1);
  };

  const createdDashBoard = (name: string, color: string) => {
    setTempDashBoardName([name, color]);
    setModalOpen6(false);
  };

  useEffect(() => {}, [tempDashBoardName]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleDashboardClick = (dashboardId: string) => {
    setPage(page);
    setSelectedDashboardId(dashboardId);
    router.push(`/dashboard/${dashboardId}`);
  };

  return (
    <S.SidebarWrapper>
      <S.Logo onClick={handleLogoClick}>
        <LogoIcon />
        <S.LogoText />
      </S.Logo>
      <S.AddDashBoard>
        <S.AddText>Dash Boards</S.AddText>
        <S.AddDashBoardIcon onClick={openModal6} />
      </S.AddDashBoard>
      <ul>
        {dashboards?.map((dashboard: Dashboard) => {
          return (
            <S.DashboardItemWrapper
              key={dashboard.id}
              onClick={() => handleDashboardClick(dashboard.id)}
              isActive={
                dashboard.id === selectedDashboardId ||
                dashboard.id === Number(router.query.id)
              }
            >
              <S.CircleColor>
                <CircleColor color={dashboard.color} />
              </S.CircleColor>
              <S.DashboardItem $active={dashboard.id === selectedDashboardId}>
                {dashboard.createdByMe && <CreateByMe />} &nbsp;{' '}
                {dashboard.title}
              </S.DashboardItem>
            </S.DashboardItemWrapper>
          );
        })}
        <NewDashBoardModal
          isOpen={isModalOpen6}
          onClose={closeModal6}
          onCreate={createdDashBoard}
        />
      </ul>
      <S.PageNavigationBox>
        <S.Buttons>
          <S.ArrowButton disabled={page <= 1} onClick={handlePrevBtnClick}>
            <ArrowLeft />
          </S.ArrowButton>
          <S.ArrowButton
            disabled={page >= totalPages}
            onClick={handleNextBtnClick}
          >
            <ArrowRight />
          </S.ArrowButton>
        </S.Buttons>
        <S.PageCount>
          {page} page of {totalPages}
        </S.PageCount>
      </S.PageNavigationBox>
    </S.SidebarWrapper>
  );
}

export default Sidebar;

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';
import DropDown from '@/components/common/DropDown';
import Button from '@/components/common/button/Button';
import TeamMemberInviteModal from '@/components/common/modal/TeamMemberInviteModal';
import AvatarList from '@/components/dashboard/AvatarList';
import useDetailDashboardQuery from '@/hooks/query/dashboards/useDetailDashboardQuery';
import useTeamMemberInviteModalMutation from '@/hooks/query/dashboards/useTeamMemberInviteModalMutation';
import useMemberListQuery from '@/hooks/query/members/useMemberListQuery';
import { useMyProfileQuery } from '@/hooks/query/users/useMyProfileQuery';
import useWindowSize, { Size } from '@/hooks/useWindowSize';
import { BUTTON_TYPE } from '@/constants/BUTTON_TYPE';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';
import CreateByMe from '@/public/icon/creatByMe.svg';
import InvitationIcon from '@/public/icon/plus.svg';
import SettingIcon from '@/public/icon/setting.svg';
import defaultImg from '@/public/image/defaultImg.jpeg';
import theme from '@/styles/theme';

const S = {
  HeaderLayout: styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 98;

    width: 100%;
    height: 7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-top: none;
    border-bottom: 1px solid ${theme.color.grayLight};

    background-color: ${theme.color.white};
    ${MEDIA_QUERIES.onPc} {
      padding-left: 30rem;
    }
    ${MEDIA_QUERIES.onTablet} {
      padding-left: 16rem;
    }
    ${MEDIA_QUERIES.onMobile} {
      padding-left: 6.7rem;
      height: 6rem;
    }
  `,

  MenuNameContainer: styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    padding-left: 3rem;

    font-weight: 700;
    font-size: 2rem;

    ${MEDIA_QUERIES.onTablet} {
      display: none;
    }
    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,
  CreateByMe: styled(CreateByMe)`
    width: 2rem;
    height: 1.6rem;
  `,
  ButtonAndUserContainer: styled.div`
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
  `,
  ButtonContainer: styled.div<{ $myPage: boolean }>`
    display: ${({ $myPage }) => ($myPage ? 'none' : 'flex')};

    gap: 1rem;

    ${MEDIA_QUERIES.onMobile} {
      gap: 0.6rem;
    }
  `,
  SettingIcon: styled(SettingIcon)`
    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,
  InvitationIcon: styled(InvitationIcon)`
    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,

  Button: styled(Button)`
    display: flex;
    padding: 0.7rem 1.7rem;
    gap: 0.2rem;

    color: ${theme.color.grayDark};

    ${MEDIA_QUERIES.onMobile} {
      padding: 0.6rem 1.2rem;
    }
  `,

  InvitedUsersBox: styled.div<{ $myPage: boolean }>`
    position: relative;
    display: ${({ $myPage }) => ($myPage ? 'none' : 'flex')};
    align-items: center;
    margin: 0 3.2rem 0 2rem;

    ${MEDIA_QUERIES.onMobile} {
      margin: 0 1.2rem;
    }
  `,

  InvitedUserImage: styled(Image)`
    ${MEDIA_QUERIES.onMobile} {
      width: 3.4rem;
      height: 3.4rem;
    }
  `,

  RestUsers: styled.div`
    position: relative;
    display: flex;
    align-items: center;
    margin-left: -0.8rem;
  `,

  RestUserIcon: styled(Image)`
    ${MEDIA_QUERIES.onMobile} {
      width: 3.4rem;
      height: 3.4rem;
    }
  `,

  RestUserText: styled.span`
    position: absolute;
    left: 0.7rem;

    font-weight: 700;
    color: ${theme.color.pink};

    ${MEDIA_QUERIES.onMobile} {
      font-size: 1.4rem;
    }
  `,

  ProfileBox: styled.div<{ $myPage: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0 4rem 0 3.2rem;
    border-left: ${({ $myPage }) =>
      $myPage ? 'none' : `1px solid ${theme.color.grayLight}`};
    gap: 1rem;

    ${MEDIA_QUERIES.onMobile} {
      padding: 0 1rem;
    }
  `,

  ProfileImg: styled(Image)`
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.08) 0 0.5rem 2rem 0;
  `,

  ProfileName: styled(DropDown)`
    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,
};

interface HeaderProps {
  myPage: boolean;
}

function DashBoardHeader({ myPage }: HeaderProps) {
  const [isModalOpen5, setModalOpen5] = useState(false);
  const openModal5 = () => setModalOpen5(true); // 모달을 여는 함수
  const closeModal5 = () => setModalOpen5(false); // 모달을 닫는 함수
  const { width }: Size = useWindowSize();
  const isPc: boolean = width !== undefined && width >= 1200;
  const router = useRouter();
  const { id } = router.query;
  const dashboardId = Number(id);

  const { data: myProfile } = useMyProfileQuery();
  const { data: dashBoardDetail } = useDetailDashboardQuery(dashboardId);
  const { mutate: inviteUser } = useTeamMemberInviteModalMutation();
  const { data: memberList } = useMemberListQuery(dashboardId);
  const myEmail = myProfile?.email;
  const filteredMemberList = memberList?.members?.filter(
    (member: string | any) => member.email !== myEmail,
  );

  const handleEdit = () => {
    router.push(`/dashboard/${id}/edit`);
  };

  const handleEmail = (email: string) => {
    inviteUser({ dashboardId, email });
  };
  return (
    <S.HeaderLayout>
      <S.MenuNameContainer>
        {dashBoardDetail?.title}
        {dashBoardDetail?.createdByMe && <S.CreateByMe />}
      </S.MenuNameContainer>

      <S.ButtonAndUserContainer>
        <S.ButtonContainer $myPage={myPage}>
          {dashBoardDetail?.createdByMe && (
            <S.Button
              styleType={BUTTON_TYPE.SECONDARY}
              size="S"
              onClick={handleEdit}
            >
              <S.SettingIcon />
              관리
            </S.Button>
          )}
          <S.Button
            styleType={BUTTON_TYPE.SECONDARY}
            size="S"
            onClick={openModal5}
          >
            <S.InvitationIcon />
            초대하기
          </S.Button>
          <TeamMemberInviteModal
            isOpen={isModalOpen5}
            onClose={closeModal5}
            onSubmit={handleEmail}
          />
        </S.ButtonContainer>
        <S.InvitedUsersBox $myPage={myPage}>
          {filteredMemberList && (
            <AvatarList max={isPc ? 5 : 3} dataArr={filteredMemberList} />
          )}
        </S.InvitedUsersBox>
        <S.ProfileBox $myPage={myPage}>
          <S.ProfileImg
            src={
              myProfile?.profileImageUrl
                ? myProfile.profileImageUrl
                : defaultImg
            }
            width={38}
            height={38}
            alt="profileImg"
          />
          <S.ProfileName userName={myProfile?.nickname} />
        </S.ProfileBox>
      </S.ButtonAndUserContainer>
    </S.HeaderLayout>
  );
}

export default DashBoardHeader;

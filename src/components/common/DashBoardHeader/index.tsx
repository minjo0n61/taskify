import Image from 'next/image';
import styled from 'styled-components';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';
import theme from '@/styles/theme';

interface HeaderProps {
  menuName: string;
  profileName: string;
  profileImgURL: string;
  invitedUsers: string[];
}
const S = {
  Header: styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 7rem;
    border-bottom: 0.1rem solid ${theme.color.grayLight};
    ${MEDIA_QUERIES.onPc} {
      padding-left: 30rem;
    }
    ${MEDIA_QUERIES.onTablet} {
      padding-left: 16rem;
    }
    ${MEDIA_QUERIES.onMobile} {
      padding-left: 6.7rem;
    }
  `,
  MenuNameAndButtonBox: styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
  `,
  MenuName: styled.div`
    font-weight: 700;
    ${MEDIA_QUERIES.onTablet} {
      display: none;
    }
    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,

  Button: styled.button`
    margin-left: 2rem;
  `,

  InvitedUsersBox: styled.div`
    display: flex;
    align-items: center;
    margin: 0 2rem;
  `,
  ProfileBox: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    border-left: 1px solid ${theme.color.grayLight};
    gap: 1rem;
  `,
  ProfileName: styled.div`
    font-size: 1.6rem;
    font-weight: 500;

    ${MEDIA_QUERIES.onMobile} {
      display: none;
    }
  `,
};

function DashBoardHeader({
  menuName,
  profileName,
  profileImgURL,
  invitedUsers,
}: HeaderProps) {
  return (
    <S.Header>
      <S.MenuNameAndButtonBox>
        <S.MenuName>{menuName}</S.MenuName>
        <div>
          <S.Button>관리</S.Button>
          <S.Button>초대하기</S.Button>
        </div>
      </S.MenuNameAndButtonBox>
      <S.InvitedUsersBox>
        {invitedUsers &&
          invitedUsers.map((userImgUrl, index) => (
            <Image
              width={38}
              height={38}
              src={userImgUrl}
              alt={'invitedUsers'}
              style={{
                marginLeft: `${0 - 8}px`,
                zIndex: invitedUsers.length - index,
              }}
            />
          ))}
      </S.InvitedUsersBox>
      <S.ProfileBox>
        <Image src={profileImgURL} width={38} height={38} alt="profileImg" />
        <S.ProfileName>{profileName}</S.ProfileName>
      </S.ProfileBox>
    </S.Header>
  );
}

export default DashBoardHeader;

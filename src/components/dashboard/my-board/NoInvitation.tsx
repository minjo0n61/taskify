import { styled } from 'styled-components';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';
import MessageIcon from '@/public/icon/messageIcon.svg';

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2.4rem;
    margin-top: 6.7rem;

    font-size: 1.8rem;
    color: ${({ theme }) => theme.color.gray};

    ${MEDIA_QUERIES.onMobile} {
      font-size: 1.4rem;
    }
  `,
};

function NoInvitation() {
  return (
    <S.Container>
      <MessageIcon />
      초대받은 대시보드가 없어요✨
    </S.Container>
  );
}

export default NoInvitation;

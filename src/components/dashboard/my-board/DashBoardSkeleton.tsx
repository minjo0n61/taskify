import { styled } from 'styled-components';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';
import ArrowRightIcon from '@/public/icon/arrowRight.svg';
import { GridTemplate, Shimmer } from '@/styles/CommonStyle';

const S = {
  Container: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 2.5rem 2rem;
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.color.white};
    /* box-shadow: rgba(0, 0, 0, 0.07) 0 1rem 1.6rem 0; */

    ${MEDIA_QUERIES.onMobile} {
      padding: 2rem;
    }
  `,

  BoardTitle: styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;

    .circle {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;

      background-color: ${({ theme }) => theme.color.skeleton};
      overflow: hidden;
      border-radius: 0.4rem;
    }

    .title {
      width: 12rem;
      height: 2.3rem;
      background-color: ${({ theme }) => theme.color.skeleton};
      overflow: hidden;
      border-radius: 0.4rem;
    }

    ${MEDIA_QUERIES.onMobile} {
      padding: 2rem;
      height: 1.6rem;
    }
  `,
};

function DashBoardSkeleton() {
  return (
    <>
      <GridTemplate>
        {Array.from({ length: 6 }).map((_, index) => (
          <S.Container key={index}>
            <S.BoardTitle>
              <div className="circle">
                <Shimmer />
              </div>
              <div className="title">
                <Shimmer />
              </div>
            </S.BoardTitle>
            <ArrowRightIcon />
          </S.Container>
        ))}
      </GridTemplate>
    </>
  );
}

export default DashBoardSkeleton;

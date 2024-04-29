import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import styled from 'styled-components';
import useDetailDashboardQuery from '@/hooks/query/dashboards/useDetailDashboardQuery';
import ColorCheckIcon from '@/public/icon/colorCheckIcon.svg';
import theme from '@/styles/theme';

const resultColorState = atom({
  key: 'resultColorState',
  default: '',
});

const S = {
  ColorArea: styled.div`
    display: inline-flex;

    justify-content: center;
    align-items: center;
    gap: 1rem;
  `,
  ColorPalette: styled.div<{ $bg: Color; $showIcon: boolean }>`
    position: relative;

    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
    background-color: ${(props) => props.$bg};
    border-radius: 50%;

    cursor: pointer;

    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `,
  IconContainer: styled.div<{ $showIcon: boolean }>`
    position: absolute;

    top: 88%;
    left: 68%;
    scale: 2;
    transform: translate(-50%, -50%);
    opacity: ${(props) =>
      props.$showIcon ? '1' : '0'}; // 아이콘을 보이거나 숨기기 위해 투명도 조절
    transition: opacity 0.1s ease-in-out;
  `,
};

type Color = string;

interface ColorPalette {
  [key: string]: Color;
}

const colorPalette: ColorPalette = {
  green: theme.color.green,
  purple: theme.color.purple,
  orange: theme.color.orange,
  blue: theme.color.skyBlue,
  pink: theme.color.pink,
};

function ColorSelector(): JSX.Element {
  const lastClickedColor = useRef<Color>('');
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>('');
  const [resultColor, setResultColor] = useRecoilState(resultColorState);
  const router = useRouter();
  const { data: dashDetail } = useDetailDashboardQuery(Number(router.query.id));

  const handleColorClick = (color: Color) => {
    lastClickedColor.current = color;
    setShowIcon(true);
    setCurrentColor(color);
    setResultColor(color);
  };

  useEffect(() => {
    if (router.asPath.includes('/edit') && dashDetail?.color) {
      handleColorClick(dashDetail?.color);
    }
  }, [dashDetail, router.asPath]);

  return (
    <S.ColorArea>
      {Object.entries(colorPalette).map(([colorName, colorValue]) => (
        <S.ColorPalette
          key={colorName}
          $bg={colorValue}
          onClick={() => handleColorClick(colorValue)}
          $showIcon={colorValue === currentColor && showIcon}
        >
          <S.IconContainer $showIcon={colorValue === currentColor && showIcon}>
            <ColorCheckIcon />
          </S.IconContainer>
        </S.ColorPalette>
      ))}
    </S.ColorArea>
  );
}

export { ColorSelector, resultColorState };

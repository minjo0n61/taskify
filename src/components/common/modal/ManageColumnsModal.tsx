import { useEffect, useState } from 'react';
import styled from 'styled-components';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/button/Button';
import BackDropModal from '@/components/common/modal/BackDropModal';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';

const S = {
  Title: styled.p`
    margin-bottom: 3.2rem;

    color: ${({ theme }) => theme.color.body};
    font-size: 2.4rem;
    font-weight: 700;
  `,
  Text: styled.p`
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.color.body};
    font-size: 1.8rem;
    font-weight: 500;
  `,
  Input: styled(InputField)`
    min-width: 48.4rem;
    padding: 1.5rem 1.6rem 1.4rem;
    margin-bottom: 2.8rem;

    border-radius: 0.6rem;
    border: 1px solid ${({ theme }) => theme.color.grayLight};
    background: ${({ theme }) => theme.color.white};

    color: ${({ theme }) => theme.color.body};
    font-weight: 400;
    font-size: 1.6rem;

    ${MEDIA_QUERIES.onMobile} {
      min-width: 29rem;
      margin-bottom: 2.4rem;
    }
  `,
  ImportButton: styled(Button)`
    padding: 1.4rem 4.6rem;
    ${MEDIA_QUERIES.onMobile} {
      padding: 1.2rem 5.6rem;
    }
  `,
  ButtonContainer: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1.4rem;
    ${MEDIA_QUERIES.onMobile} {
      justify-content: space-between;
    }
  `,
  DeleteButton: styled.button`
    position: absolute;
    bottom: 2rem;
    left: 2rem;

    display: flex;
    justify-content: flex-start;

    color: ${({ theme }) => theme.color.gray};
    font-size: 1.4rem;
    text-decoration-line: underline;

    ${MEDIA_QUERIES.onMobile} {
      margin-bottom: 1.6rem;
    }
  `,
};

interface ManageColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onChange: (columnName: string) => void;
  currentColumnName: string;
}

function ManageColumnsModal({
  isOpen,
  onClose,
  onChange,
  onDelete,
  currentColumnName = '',
}: ManageColumnsModalProps) {
  const [columnName, setColumnName] = useState(currentColumnName);

  useEffect(() => {
    setColumnName(currentColumnName);
  }, [currentColumnName]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnName(e.target.value);
  };

  const handleChange = () => {
    onChange(columnName);
    onClose();
  };

  return (
    <BackDropModal isOpen={isOpen} onClose={onClose}>
      <S.Title>컬럼 관리</S.Title>
      <S.Input
        label="이름"
        id="manageColumn"
        placeholder="새로운 프로젝트"
        value={columnName}
        onChange={handleInputChange}
      />
      <S.DeleteButton onClick={onDelete}>삭제하기</S.DeleteButton>
      <S.ButtonContainer>
        <S.ImportButton onClick={onClose} styleType="SECONDARY" size="M">
          취소
        </S.ImportButton>
        <S.ImportButton onClick={handleChange} styleType="PRIMARY" size="M">
          생성
        </S.ImportButton>
      </S.ButtonContainer>
    </BackDropModal>
  );
}

export default ManageColumnsModal;
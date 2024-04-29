import styled from 'styled-components';
import FormInput from '@/components/common/form/Form';
import WarningModal from '@/components/common/modal/WarningModal';
import usePasswordChangeMutation from '@/hooks/query/auth/usePasswordChangeMutation';
import MEDIA_QUERIES from '@/constants/MEDIAQUERIES';
import { FormValues } from '@/types/Form';

const S = {
  Layout: styled.div`
    width: 62rem;
    height: 45.5rem;
    padding: 3.2rem 2.8rem 2.8rem 2.8rem;
    margin: 1.2rem 2rem 0 0;
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.color.white};

    ${MEDIA_QUERIES.onMobile} {
      width: 28.4rem;
      height: 45.2rem;
      margin-top: 1.2rem;
    }
  `,
  Container: styled.div``,
  Title: styled.span`
    font-size: 2.4rem;
    font-weight: 700;
  `,
  PasswordContent: styled.div`
    margin-top: 1.2rem;

    & > * {
      margin-top: 2rem;
    }
  `,
};

function PasswordChange() {
  const {
    mutate: passwordChange,
    open,
    setOpen,
    modalMessage,
  } = usePasswordChangeMutation();
  const editMyPassword = (data: FormValues) => {
    if ('nowPassword' in data && 'newPassword' in data) passwordChange(data);
  };

  return (
    <S.Layout>
      <S.Container>
        <S.Title>비밀번호 변경</S.Title>
        <S.PasswordContent>
          <FormInput
            submit={editMyPassword}
            formType="editPassword"
            btnSize="S"
            children={undefined}
          />
        </S.PasswordContent>
        <WarningModal
          isOpen={open}
          onClose={() => setOpen(false)}
          message={modalMessage}
        />
      </S.Container>
    </S.Layout>
  );
}

export default PasswordChange;

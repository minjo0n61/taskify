import Image from 'next/image';
import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import Button from '@/components/common/button/Button';
import formFields from '@/constants/FORM_FIELDS';
import { EditPassword, EditProfile, SignIn, SignUp } from '@/constants/SCHEMA';
import { FormValues } from '@/types/Form';

const S = {
  Form: styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.8rem;
    width: 100%;
  `,
  Container: styled.div`
    position: relative;
    margin-top: 0.4rem;
    width: 100%;
  `,
  Label: styled.label`
    color: ${({ theme }) => theme.color.body};
    font-size: 1.6rem;
  `,
  Input: styled.input<{ error?: boolean }>`
    display: flex;
    align-items: center;
    position: relative;
    margin: 0.8rem 0;
    gap: 1rem;

    width: 100%;
    padding: 1.5rem 1.6rem;
    border-radius: 0.8rem;
    border: 1px solid
      ${({ error, theme }) => (error ? theme.color.red : theme.color.grayLight)};
    background: ${({ theme }) => theme.color.white};

    &::placeholder {
      color: ${({ theme }) => theme.color.gray};
      font-size: 1.6rem;
    }

    &:focus {
      border: 1px solid ${({ theme }) => theme.color.purple};
    }
  `,
  EyeIcon: styled.div`
    position: absolute;
    top: 3.8rem;
    right: 1.6rem;
    cursor: pointer;
  `,
  Error: styled.p`
    position: absolute;

    color: ${({ theme }) => theme.color.red};
  `,
  CheckWrapper: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem 0;
  `,
  CheckBox: styled.input`
    display: none;

    &:checked + label::after {
      content: '✔';
      color: ${({ theme }) => theme.color.primary};
      font-size: 1.4rem;
      line-height: 2rem;
      text-align: center;
    }
  `,
  CheckBoxText: styled.label`
    position: relative;
    cursor: pointer;
    color: ${({ theme }) => theme.color.body};
    padding-left: 3rem;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: -0.4rem;
      width: 2rem;
      height: 2rem;
      border: 1px solid ${({ theme }) => theme.color.grayLight};
      border-radius: 0.4rem;
      background-color: white;
    }
  `,
  Button: styled(Button)`
    width: ${(props) => (props.size === 'S' ? '8.4rem' : '100%')};
    margin-top: 1rem;
    padding: ${(props) => (props.size === 'S' ? '0.8rem' : '1.4rem')};
    font-size: ${(props) => (props.size === 'S' ? '1.4rem' : null)};
  `,
};

const buttonText = {
  signIn: '로그인',
  signUp: '회원가입',
  editProfile: '저장',
  editPassword: '변경',
};

type FormType = 'signIn' | 'signUp' | 'editProfile' | 'editPassword';

interface FormProps extends InputHTMLAttributes<HTMLInputElement> {
  formType: FormType;
  btnSize?: 'S' | 'M' | 'L';
  submit?: (data: FormValues) => void;
  profileInfo?: { mail: string; name: string };
  children?: React.ReactNode;
  // placeholder?: { email?: string; name?: string };
}

/**
 * @param formType: 'signIn' | 'signUp' | 'editProfile' | 'editPassword' 사용하는 용도에 맞게 입력
 */

function Form({
  formType,
  btnSize = 'L',
  submit,
  profileInfo,
  children,
  ...htmlInputProps
}: FormProps) {
  const [passwordFieldType, setPasswordFieldType] = useState('password');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [profile, setProfile] = useState(profileInfo);

  const schemaForFormType = {
    signIn: SignIn,
    signUp: SignUp,
    editProfile: EditProfile,
    editPassword: EditPassword,
  };

  const schema = schemaForFormType[formType];
  const formOptions = { resolver: schema ? zodResolver(schema) : undefined };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormValues>(formOptions);

  const Keys = {
    signIn: ['email', 'password'],
    signUp: ['email', 'name', 'password', 'passwordCheck', 'terms'],
    editProfile: ['email', 'name'],
    editPassword: ['nowPassword', 'newPassword', 'newPasswordCheck'],
  };

  const watchFields = watch();

  useEffect(() => {
    if (formType === 'editProfile' && profileInfo) {
      setValue('email', profileInfo?.mail, { shouldValidate: true });
      setValue('name', profileInfo?.name, { shouldValidate: true });
    }
  }, [formType, setValue, profileInfo]);

  useEffect(() => {
    const requiredKeys = Keys[formType];
    let allFieldsFilled = false;
    const termsChecked = formType === 'signUp' ? watchFields.terms : true;

    if (formType === 'editProfile') {
      const filteredKeys = requiredKeys.filter((key) => key !== 'email');
      allFieldsFilled = filteredKeys.every(
        (key) => (watchFields as any)[key]?.length > 0,
      );
    } else if (formType === 'signUp') {
      allFieldsFilled = requiredKeys.every((key) => {
        if (key === 'terms') return (watchFields as any)[key];
        return (watchFields as any)[key]?.length > 0;
      });
    } else {
      allFieldsFilled = requiredKeys.every(
        (key) => (watchFields as any)[key]?.length > 0,
      );
    }

    setIsButtonDisabled(!allFieldsFilled);
  }, [watchFields, formType]);

  const togglePasswordFieldType = () => {
    setPasswordFieldType(
      passwordFieldType === 'password' ? 'text' : 'password',
    );
  };

  const fieldsToRender = formFields[formType] || [];
  return (
    <S.Form onSubmit={handleSubmit(submit)}>
      {fieldsToRender.map((field) => (
        <S.Container key={field.id}>
          <S.Label htmlFor={field.id}>{field.label}</S.Label>
          <S.Input
            id={field.id}
            type={
              field.id === 'password' || field.id === 'passwordCheck'
                ? passwordFieldType
                : field.type
            }
            placeholder={(() => {
              if (formType === 'editProfile') {
                if (field.id === 'email') return profile?.mail;
                if (field.id === 'name') return profile?.name;
              }
              return field.placeholder;
            })()}
            disabled={!!(formType === 'editProfile' && field.id === 'email')}
            value={
              formType === 'editProfile' && field.id === 'email'
                ? profileInfo?.mail
                : undefined
            }
            {...htmlInputProps}
            {...(formType !== 'editProfile' || field.id !== 'email'
              ? register(field.id as keyof FormValues)
              : {})}
            onBlur={() => {
              if (field.id === 'password' || field.id === 'passwordCheck') {
                trigger(['password', 'passwordCheck']);
              } else {
                trigger(field.id as keyof FormValues);
              }
            }}
            error={!!errors[field.id as keyof FormValues]}
          />
          {(field.id === 'password' || field.id === 'passwordCheck') && (
            <S.EyeIcon onClick={togglePasswordFieldType}>
              <Image
                src={
                  passwordFieldType === 'password'
                    ? '/icon/eyeOff.svg'
                    : '/icon/eyeOn.svg'
                }
                alt="비밀번호 토글"
                width={24}
                height={24}
              />
            </S.EyeIcon>
          )}
          {errors[field.id as keyof FormValues] && (
            <S.Error>
              {(errors[field.id as keyof FormValues] as Error)?.message}
            </S.Error>
          )}
        </S.Container>
      ))}
      {formType === 'signUp' && (
        <S.CheckWrapper>
          <S.CheckBox id="terms" type="checkbox" {...register('terms')} />
          <S.CheckBoxText htmlFor="terms">
            이용약관에 동의합니다.
          </S.CheckBoxText>
        </S.CheckWrapper>
      )}
      <S.Button type="submit" size={btnSize} disabled={isButtonDisabled}>
        {buttonText[formType]}
      </S.Button>
    </S.Form>
  );
}

export default Form;

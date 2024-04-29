import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import DateSelector from '@/components/common/DateSelector';
import { ImgFileUpload } from '@/components/common/ImgFileUpload';
import SelectBox from '@/components/common/SelectBox';
import Button from '@/components/common/button/Button';
import BackDropModal from '@/components/common/modal/BackDropModal';
import HashTag from '@/components/common/tag/HashTag';
import { formatDueDate } from '@/utils/formatDate';
import useDetailCardQuery from '@/hooks/query/cards/useDetailCardQuery';
import useEditCardMutation from '@/hooks/query/cards/useEditCardMutation';
import useColumnListQuery from '@/hooks/query/columns/useColumnListQuery';
import useMemberListQuery from '@/hooks/query/members/useMemberListQuery';
import { BUTTON_TYPE } from '@/constants/BUTTON_TYPE';
import { RequiredStar } from '@/styles/CommonStyle';

const S = {
  Title: styled.h1`
    font-size: 2.4rem;
    font-weight: 700;
  `,

  FormContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 2.8rem;
    margin-top: 2.4rem;

    @media screen and (min-width: 768px) {
      width: 46rem;
      margin-top: 3.2rem;
    }
  `,

  Low: styled.div`
    display: flex;
    justify-content: space-between;
  `,

  FieldBox: styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,

  Label: styled.label`
    font-size: 1.7rem;
    font-weight: 500;

    &.required {
      ${RequiredStar('after')}
    }

    @media screen and (max-width: 768px) {
      font-size: 1.6rem;
    }
  `,

  Input: styled.input`
    width: 100%;
    height: 4.8rem;
    padding: 1.6rem;
    border: ${({ theme }) => theme.border.lightGray};
    border-radius: 0.4rem;
    font-size: 1.6rem;

    &::placeholder {
      color: ${({ theme }) => theme.color.gray};
    }

    @media screen and (max-width: 768px) {
      font-size: 1.4rem;
    }
  `,

  Textarea: styled.textarea`
    min-height: 10rem;
    padding: 1.6rem;
    border: ${({ theme }) => theme.border.lightGray};
    border-radius: 0.4rem;
    font-size: 1.6rem;

    &:focus {
      outline: none;
    }
    &::placeholder {
      color: ${({ theme }) => theme.color.gray};
    }

    @media screen and (max-width: 768px) {
      font-size: 1.4rem;
    }
  `,

  TagList: styled.div`
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
  `,

  ButtonContainer: styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1.2rem;

    margin-top: 2.8rem;
  `,

  Tag: styled(HashTag)`
    display: flex;

    &button {
      margin-left: 1rem;
    }
  `,
};

function ToDoEditModal({ isOpen, onClose, cardId, dashboardId }: any) {
  const { data: cardDetailData } = useDetailCardQuery({ cardId });
  const [toDoInfo, setToDoInfo] = useState({
    columnId: cardDetailData?.columnId,
    assigneeUserId: cardDetailData?.assignee.id,
    title: cardDetailData?.title,
    description: cardDetailData?.description,
    dueDate: cardDetailData?.dueDate,
    tags: cardDetailData?.tags,
    imageUrl: cardDetailData?.imageUrl,
  });

  const dashId = Number(dashboardId);

  useEffect(() => {
    setToDoInfo({
      columnId: cardDetailData?.columnId,
      assigneeUserId: cardDetailData?.assignee.id,
      title: cardDetailData?.title,
      description: cardDetailData?.description,
      dueDate: cardDetailData?.dueDate,
      tags: cardDetailData?.tags,
      imageUrl: cardDetailData?.imageUrl,
    });
  }, [cardDetailData]);

  const { data: membersData } = useMemberListQuery(dashboardId);
  const assigneeOptions = membersData?.members;
  const { data: stateOptions } = useColumnListQuery({ dashboardId: dashId });
  const { mutate: editMutate } = useEditCardMutation(onClose, cardId);

  const stateTitle = stateOptions?.find(
    (item) => item.id === cardDetailData?.columnId,
  )?.title;

  const isFilledRequiredFields = () => {
    return toDoInfo?.title?.trim() && toDoInfo.description?.trim();
  };

  const handleOnChange = (fieldName: string, value: string | string[]) => {
    setToDoInfo((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag) {
        setToDoInfo((prev) =>
          prev?.tags
            ? {
                ...prev,
                tags: [...prev.tags, newTag],
              }
            : null,
        );
        e.currentTarget.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setToDoInfo((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (url: string) => {
    setToDoInfo((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };

  const handleEditBtnClick = () => {
    editMutate(toDoInfo);
  };

  return (
    <BackDropModal isOpen={isOpen} onClose={onClose}>
      <S.Title>📌 할 일 수정</S.Title>
      <S.FormContainer>
        <S.Low>
          <S.FieldBox>
            <S.Label>상태</S.Label>
            <SelectBox
              initialValue={stateTitle}
              options={stateOptions}
              placeholder={false}
              onChange={(option) => handleOnChange('columnId', option.id)}
              displayFieldName="title"
            />
          </S.FieldBox>
          <S.FieldBox>
            <S.Label>담당자</S.Label>
            <SelectBox
              initialValue={cardDetailData?.assignee.nickname}
              options={assigneeOptions}
              placeholder={false}
              onChange={(option) =>
                handleOnChange('assigneeUserId', option.userId)
              }
              displayFieldName="nickname"
            />
          </S.FieldBox>
        </S.Low>

        <S.FieldBox>
          <S.Label htmlFor="title" className="required">
            제목
          </S.Label>
          <S.Input
            id="title"
            type="text"
            value={toDoInfo?.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleOnChange('title', e.target.value)
            }
          />
        </S.FieldBox>

        <S.FieldBox>
          <S.Label htmlFor="description" className="required">
            설명
          </S.Label>
          <S.Textarea
            id="description"
            value={toDoInfo?.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleOnChange('description', e.target.value)
            }
          />
        </S.FieldBox>

        <S.FieldBox>
          <S.Label>마감일</S.Label>
          <DateSelector
            value={formatDueDate(toDoInfo?.dueDate)}
            onChange={(date) => {
              handleOnChange('dueDate', formatDueDate(date));
            }}
          />
        </S.FieldBox>

        <S.FieldBox>
          <S.Label htmlFor="tag">태그</S.Label>
          <S.Input
            id="tag"
            type="text"
            placeholder="태그 입력후 Enter!"
            onKeyPress={handleTagInput}
          />
        </S.FieldBox>
        <S.TagList>
          {toDoInfo?.tags?.map((tag, index) => (
            <S.Tag key={index} index={index}>
              {tag}
              <button
                onClick={() => removeTag(tag)}
                style={{ marginLeft: '0.05rem' }}
              >
                X
              </button>
            </S.Tag>
          ))}
        </S.TagList>

        <S.FieldBox>
          <S.Label>이미지</S.Label>
          <ImgFileUpload
            edit
            small
            onImageUpload={handleImageUpload}
            columnId={toDoInfo?.columnId}
            initialImageUrl={cardDetailData?.imageUrl}
          />
        </S.FieldBox>
      </S.FormContainer>

      <S.ButtonContainer>
        <Button styleType={BUTTON_TYPE.SECONDARY} onClick={onClose}>
          취소
        </Button>
        <Button
          disabled={!isFilledRequiredFields()}
          onClick={handleEditBtnClick}
        >
          수정
        </Button>
      </S.ButtonContainer>
    </BackDropModal>
  );
}

export default ToDoEditModal;

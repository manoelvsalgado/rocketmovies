import styled from "styled-components";

export const Container = styled.textarea`
  width: 100%;
  min-height: 170px;

  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
  color: ${({ theme }) => theme.COLORS.WHITE};

  border: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
  resize: none;

  margin-bottom: 8px;
  border-radius: 10px;
  padding: 16px;
  line-height: 1.6;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.COLORS.PINK};
  }

  &::placeholder {
    color: ${({ theme }) => theme.COLORS.GRAY_300};
  }
`;
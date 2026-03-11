import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
  color: ${({ theme }) => theme.COLORS.GRAY_300};

  margin-bottom: 8px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
  transition: border-color 0.2s;

  &:focus-within {
    border-color: ${({ theme }) => theme.COLORS.PINK};
  }

  > input {
    height: 56px;
    width: 100%;

    padding: 12px 14px;

    color: ${({ theme }) => theme.COLORS.WHITE};
    background: transparent;
    border: 0;

    &::placeholder {
      color: ${({ theme }) => theme.COLORS.GRAY_300};
    }
    }
 
    > svg {
      margin-left: 16px;
      flex-shrink: 0;
    }
`;
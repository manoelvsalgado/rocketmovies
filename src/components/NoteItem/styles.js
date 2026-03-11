import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  min-width: 220px;
  flex: 1;

  background-color: ${({ theme , isNew }) => isNew ? "transparent" : theme.COLORS.BACKGROUND_900};
  color: ${({ theme }) => theme.COLORS.GRAY_300};

  border: ${({ theme , isNew }) => isNew ? `1px dashed ${theme.COLORS.GRAY_300}` : `1px solid ${theme.COLORS.BACKGROUND_700}`};

  margin-bottom: 8px;
  border-radius: 10px;
  padding-right: 16px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: ${({ theme }) => theme.COLORS.PINK};
  }

  > button {
    border: none;
    background: none;
  }

  .button-delete {
    color: ${({ theme }) => theme.COLORS.RED};
  }

  .button-add {
    color: ${({ theme }) => theme.COLORS.ORANGE};
  }

  > input {
    height: 56px;
    width: 100%;

    padding: 12px 14px;

    color: ${({ theme }) => theme.COLORS.WHITE};
    background: transparent;
    border: none;

    &::placeholder {
      color: ${({ theme }) => theme.COLORS.GRAY_300};
    }
  }
`;

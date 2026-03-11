import styled from "styled-components";

export const Container = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.PINK};
  color: ${({ theme }) => theme.COLORS.BACKGROUND_800};

  height: 56px;
  border: 0;
  padding: 0 16px;
  margin-top: 16px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:not(:disabled):hover {
    filter: brightness(0.92);
  }

  &:disabled {
    opacity: 0.5;
  }
`;
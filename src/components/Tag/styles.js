import styled from "styled-components";

export const Container = styled.span`
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
  background-color: ${({ theme }) => theme.COLORS.ORANGE};
  font-weight: 600;
`;
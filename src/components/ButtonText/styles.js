import styled from "styled-components";

export const Container = styled.button`
  background: none;
  color: ${({ theme, isActive }) => isActive ? theme.COLORS.ORANGE : theme.COLORS.GRAY_100};

  border: none;
  font-size: 15px;
  font-weight: 600;
  text-align: right;

  @media (max-width: 720px) {
    text-align: left;
  }
`;
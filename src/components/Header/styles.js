import styled from "styled-components";
import { Link } from 'react-router-dom';

export const Container = styled.header`
  grid-area: header;

  height: 105px;
  width: 100%;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};

  display: flex;
  justify-content: space-between;

  padding: 0 80px;

  h1 {
    color: ${({ theme }) => theme.COLORS.PINK};
    padding: 42px;
    font-family: 'Roboto Slab';
    font-weight: 700;
    font-size: 24px;
  }

  Input {
    width: 630px;
    height: 56px;
  }
`;

export const Profile = styled(Link)`
display: flex;
align-items: center;
padding: 24px;

 > img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
 }

 > div {
  width: 198px;
  height: 68px;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  line-height: 24px;



  strong {
    color: ${({ theme }) => theme.COLORS.WHITE};
    font-family: 'Roboto Slab';
    font-weight: 700;
    font-size: 14px;
   }
  }
`;

export const Logout = styled.button`
  border: none;
  background: none;

  > svg {
    color:${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 36px;
  }
`;
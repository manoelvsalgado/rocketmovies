import { Container } from './styles';
import { Tag } from '../Tag';
import { FiStar } from 'react-icons/fi';

export function Note({ data, ...rest }){
  const rating = Number(data.rating || 0);

  return(
    <Container {...rest}>
      <h1>{data.title}</h1>

      <div className="rating">
        {Array.from({ length: 5 }).map((_, index) => (
          <FiStar key={`star-${data.id || data.title}-${index}`} className={index < rating ? 'filled' : ''} />
        ))}
      </div>

      {data.description && <p>{data.description}</p>}

      {
        data.tags &&
        <footer>
          {
            data.tags.map(tag =>
              <Tag 
               key={tag.id} 
               title={tag.name} 
              />
            )
          }
        </footer>
      }
    </Container>
  );
}
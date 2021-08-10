import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const Filter: any = styled.div`
  background: ${(props) => (props.selected ? "#adabab" : "#ccc")};
  padding: 4px 8px;
  text-transform: capitalize;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 8px;
  transition: background 200ms ease-in-out;
  &:hover {
    background: #adabab;
    transition: background 200ms ease-in-out;
  }
`;

type Props = {
  filters: string[],
  selectedFilter: string,
  onClick: (filter: string) => void
}

function FellowshipFilters(props: Props) {
  const { filters, selectedFilter, onClick } = props;

  return (
    <Container>
      {filters.map((filter: string, key: number) => (
        <Filter
          key={key}
          selected={selectedFilter === filter}
          onClick={() => {
            onClick(filter);
          }}
        >
          {filter}
        </Filter>
      ))}
    </Container>
  );
}

export default FellowshipFilters;

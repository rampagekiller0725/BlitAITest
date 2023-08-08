import Materials from "./babylonjs/types/materials";

interface MaterialSelectProps {
  options: Materials;
}

export const MaterialSelectOptions = (props: MaterialSelectProps) => {
  const { options } = props;
  return (
    <>
      {Object.keys(options).map((material) => {
        return (
          <option value={material} key={material}>
            {material}
          </option>
        );
      })}
    </>
  );
};

import PropTypes from 'prop-types';

export default function ResponseHeaderPane({ response }) {
  const responseHeaders = [];

  if (response && response.headers) {
    Object.entries(response.headers).forEach(([key, value]) => {
      responseHeaders.push({ key, value });
    });
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="w-36 pb-1.5 font-semibold text-purple-600">Key</th>
          <th className="w-60 font-semibold text-purple-600">Value</th>
        </tr>
      </thead>
      <tbody>
        {responseHeaders.map(({ key, value }, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td className="py-2">{key}</td>
            <td className="py-2">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

ResponseHeaderPane.propTypes = {
  response: PropTypes.shape({
    headers: PropTypes.objectOf(PropTypes.string),
  }),
};
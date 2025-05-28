import Map from '../utils/map';
 
export async function reportMapper(report) {
  return {
    ...report,
    location: {
      ...report.location,
      placeName: await Map.getPlaceNameByCoordinate(report.location.latitude, report.location.longitude),
    },
  };
}
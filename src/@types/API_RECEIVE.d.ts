export type API_RECEIVE = {
  events: {
    Name: string;
    Location: string | null;
    Start_Date: string;
    End_Date: string | null;
    Description: string | null;
  }
};
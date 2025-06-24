import { Json as JsonGenerated } from "./__generated__/type.db";

export type Json = JsonGenerated;

// *========== USER ==========* //
export type Profile = Database['public']['Tables']['profiles']['Row'] & {
};

export type User = Profile & {

}
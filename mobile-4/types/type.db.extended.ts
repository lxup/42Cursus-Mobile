import { Database as PostgresSchema } from './__generated__/type.db';

type PostgresTables = PostgresSchema['public']['Tables'];
type PostgresViews = PostgresSchema['public']['Views'];

type TableExtensions = { 
};

type ViewExtensions = {
};
// <END>
// ☝️ this is the only thing you edit

type TakeDefinitionFromSecond<T extends object, P extends object> = Omit<
  T,
  keyof P
> &
  P;

type NewTables = {
  [k in keyof PostgresTables]: {
    Row: k extends keyof TableExtensions
      ? TakeDefinitionFromSecond<
          PostgresTables[k]['Row'],
          TableExtensions[k]
        >
      : PostgresTables[k]['Row'];
    Insert: k extends keyof TableExtensions
      ? TakeDefinitionFromSecond<
          PostgresTables[k]['Insert'],
          TableExtensions[k]
        >
      : PostgresTables[k]['Insert'];
    Update: k extends keyof TableExtensions
      ? Partial<
          TakeDefinitionFromSecond<
            PostgresTables[k]['Update'],
            TableExtensions[k]
          >
        >
      : PostgresTables[k]['Update'];
	Relationships: PostgresTables[k]['Relationships'];
  };
};

type NewViews = {
  [k in keyof PostgresViews]: {
	Row: k extends keyof ViewExtensions
	  ? TakeDefinitionFromSecond<
		  PostgresViews[k]['Row'],
		  ViewExtensions[k]
		>
	  : PostgresViews[k]['Row'];
	Relationships: PostgresViews[k]['Relationships'];
  };
};

export type Database = {
  public: Omit<PostgresSchema['public'], 'Tables' | 'Views'> & {
    Tables: NewTables;
	Views: NewViews;
  };
};

export type TableName = keyof Database['public']['Tables'];
export type TableRow<T extends TableName> =
  Database['public']['Tables'][T]['Row'];

export type ViewName = keyof Database['public']['Views'];
export type ViewRow<View extends ViewName> =
  Database['public']['Views'][View]['Row'];


import { NextRequest, NextResponse } from "next/server";
import { createUser, CreateUserResponse, ErrorResponse } from '@/lib/handlers'


export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateUserResponse | ErrorResponse>> {
  const data = await request.json();

  const user = await createUser({
    email: data.email,
    password: data.password,
    name: data.name, 
    surname: data.surname,
    address: data.address,
    birthdate: new Date(data.birthdate),
  });
  
if (user === null){
  return NextResponse.json(
    {
      error: 'USER_EXISTS',
      message: 'A user with that email already exists.',
    },
    { status: 400}
  );
}

return NextResponse.json(user, {status:201});

}
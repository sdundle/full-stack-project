<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\DataSource;
use App\Models\FeedSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    /**
     * User Register.
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse|mixed
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|min:2|max:255',
            'email' => 'required|min:2|unique:users',
            'password' => 'required|min:4|max:255|confirmed'
        ], [
            'name.required' => 'Please enter your name',
            'name.min' => 'Please enter minimum two characters',
            'email.required' => 'Please enter your email',
            'email.min' => 'Please enter minimum two characters',
            'password.required' => 'Please enter your password',
            'password.min' => 'Please enter minimum two characters',
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return response()->json(["message" => "User created successfully"], 201);
    }


    /**
     * User login.
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse|mixed
     */
    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);
        $user = User::where('email', $validatedData['email'])->first();
        if ($user) {
            if (Hash::check($validatedData['password'], $user->password)) {
                $success['token'] =  $user->createToken(env('PASSPORT_ACCESS_CLIENT_SECRET'))->accessToken;
                $success['user'] =  $user;
                $userFeed = FeedSetting::select('api_data_source', 'api_data_source_url', 'category', 'author')->where('user_id', $user->id)->first();
                $apiList = DataSource::select('api_data_source_name', 'api_data_source_key_url')->get();
                $success['user']['feed'] = $userFeed ?? [];
                $success['user']['apiList'] = $apiList ?? [];

                return response()->json(['message' => $success], 200);
            } else {
                return response()->json(["errors" => ["message" => "Invalid Credentials"]], 401);
            }
        } else {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }

    /**
     * Get the user.
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse|mixed
     */
    public function getUser(Request $request): JsonResponse
    {
        $user = $request->user();
        $success['user'] = $user;
        $userFeed = FeedSetting::select('api_data_source', 'api_data_source_url', 'category', 'author')->where('user_id', $user->id)->first();
        $apiList = DataSource::select('api_data_source_name', 'api_data_source_key_url')->get();
        $success['user']['feed'] = $userFeed ?? [];
        $success['user']['apiList'] = $apiList ?? [];
        return response()->json([
            "message" => $success
        ], 200);
    }


    /**
     * Update the user.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUser(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            $validatedData = $request->validate([
                'name' => 'required|max:255',
                'password' => '',
                'api_data_source' => 'required',
                'category' => '',
                'author' => '',
            ], [
                'name.required' => 'Please enter your name',
                'email.required' => 'Please enter your email',
                'api_data_source.required' => 'Please select api data sources'
            ]);
            if ($validatedData['password'] != NULL) {
                $user->password = Hash::make($validatedData['password']);
            }
            $user->name = $validatedData['name'];
            $user->save();

            $dataSource = DataSource::select('api_data_source_name')->where('api_data_source_key_url', $validatedData['api_data_source'])->first();

            $feed = FeedSetting::updateOrInsert(
                ['user_id' => $user->id],
                fn($exists) => $exists ? [
                    'api_data_source' => $dataSource['api_data_source_name'],
                    'api_data_source_url' => $validatedData['api_data_source'],
                    'category' => $validatedData['category'],
                    'author' => $validatedData['author']
                ] : [
                    'user_id' => $user->id,
                    'api_data_source' => $dataSource['api_data_source_name'],
                    'api_data_source_url' => $validatedData['api_data_source'],
                    'category' => $validatedData['category'],
                    'author' => $validatedData['author']
                ],
            );

            return response()->json(["message" => "User Updated Successfully"], 200);
        }
        return response()->json(["message" => "Unauthorized"], 401);
    }

    /**
     * Logout method
     * @param \Illuminate\Http\Request $request
     * @return void
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->token()->delete();
        return response()->json([
            'message' => 'Successfully logged out'
        ], 200);
    }
}

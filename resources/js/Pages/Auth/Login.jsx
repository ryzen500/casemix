import { useEffect ,useState} from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Ikon mata dari React Icons

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_pemakai: '',
        katakunci_pemakai: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false); // State untuk mengontrol visibilitas password
    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel value="username" />

                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('username', e.target.value)}
                    />

                    {console.log("Errors", errors)}
                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4 relative">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type={showPassword ? 'text' : 'password'} // Tampilkan atau sembunyikan password
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <div
                        className="absolute inset-y-0 right-0 pr-3 mt-4 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

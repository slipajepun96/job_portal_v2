<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            
                <div class="p-6 text-gray-900">
                    <div>
                    <div class="text-lg font-bold">BORANG PERMOHONAN PEKERJAAN</div>
                        <div class="flex flex-col md:flex-row">
                            <div class="md:w-3/5">
                                <table >
                                    <tr>
                                        <td style="width:200px;">Jawatan</td>
                                        <td style="width:10px;">:</td>
                                        <td class='uppercase px-1 py-1 text-sm font-semibold'>{{$vacancy_name}}</td>
                                    </tr>
                                    <tr>
                                        <td>Tarikh Temuduga</td>
                                        <td>:</td>
                                        <td style="border-bottom: 1px solid #000;"></td>
                                    </tr>
                                    <tr>
                                        <td>Jangkaan Gaji (RM)</td>
                                        <td>:</td>
                                        <td> <?php echo 'RM' . number_format($application_snapshot['expected_salary'], 2, '.', ',');  ?></td>
                                    </tr>
                                    <tr>
                                        <td>Jangkaan Masuk</td>
                                        <td>:</td>
                                        <td><?php echo date_format(new DateTime($application_snapshot['start_date']), "j/m/Y"); ?></td> 
                                    </tr>
                                </table>
                            </div>
                            <div class="md:w-2/5 pb-2 flex justify-end">
                                <div class="w-32 overflow-hidden border border-slate-900 rounded">
                                    @if (!empty($application_snapshot['resume']))
                                        <img
                                            src="data:image/jpeg;base64,{{ base64_encode(Storage::disk('local')->get($application_snapshot['resume'])) }}"
                                            alt="Passport attachment"
                                            style="max-width:100%; height:auto;"
                                        />
                                    @else
                                        <p>No attachment available.</p>
                                    @endif
                                </div>
                            </div>
                        </div>
                        <!-- /* part 1 : butiran peribadi */ -->
                        <div class='border'>
                            <div class="text-center font-bold text-sm">MAKLUMAT PERIBADI</div>   
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'>
                                    1. Nama Penuh : {{$application_snapshot['name']}}
                                </div>
                            </div>

                            <div class='grid gap-2 md:grid-cols-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'>  
                                    2. Tarikh Lahir: <?php echo date_format(new DateTime($application_snapshot['dateOfBirth']), "j/m/Y"); ?>
                                </div>

                                <div class='uppercase px-1 py-1 text-sm'> 
                                    3. Jantina : {{$application_snapshot['gender']}}
                                </div>
                            </div>  

                            <div class='grid flex-1 gap-2 md:grid-cols-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'> 
                                    4. Umur : {{$application_snapshot['age']}} Tahun
                                </div>

                                <div class='uppercase px-1 py-1 text-sm'> 
                                    5. Bangsa : {{$application_snapshot['ethnicity']}}
                                </div>
                            </div>  

                            <div class='grid flex-1 gap-2 md:grid-cols-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'> 
                                    6. Kad Pengenalan : {{$application_snapshot['ic_number']}}
                                </div>

                                <div class='uppercase px-1 py-1 text-sm'> 
                                    7. Status Perkahwinan : {{$application_snapshot['marital_status']}}
                                </div>
                            </div>      
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'> 
                                    8. Bilangan Anak : {{$application_snapshot['children_num']?? "-"}} Orang
                                </div>
                            </div>
                            
                            <div class='grid flex-1 gap-2 md:grid-cols-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'> 
                                    9. Alamat Tetap : {{$application_snapshot['address']?? "-"}}
                                </div>
                            
                                <div class='uppercase px-1 py-1 text-sm'> 
                                    10. Alamat Surat Menyurat (Sekiranya berbeza): {{$application_snapshot['address_postal']?? "-"}}
                                </div>
                            </div>

                            <div class='grid flex-1 gap-2 md:grid-cols-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'> 
                                    11. No. Telefon Bimbit : {{$application_snapshot['no_phone']?? "-"}}
                                </div>
                            
                                <div class='uppercase px-1 py-1 text-sm'> 
                                    12. No. Telefon Rumah : {{$application_snapshot['phone_home']?? "-"}}
                                </div>
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1 text-sm'> 
                                    13. E-MEL : {{$application_snapshot['email']}}
                                </div>
                            </div>
                        </div>

                        <!-- /* part 2 : butiran keluarga dan pendidikan */ -->
                        <div class="mt-2">
                            <div class="py-1 border border-black text-center">
                                <div class="uppercase px-1 py-0 font-bold text-sm" >Butiran Keluarga</div>
                                <p>(Ibu, Bapa dan 3 Saudara Terdekat)</p>
                            </div>
                            <table class="border w-full" border="1">
                                <tr class="py-3 border border-black bg-gray-200">
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Nama</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Hubungan</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Umur</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Pekerjaan</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Majikan / Sekolah</td>
                                    {{-- <td class="uppercase px-1 py-1" colspan="5"></td> --}}
                                </tr>  

                                @foreach($application_snapshot['familyMembers']?? [] as $relative_data)
                                <tr class="py-3">
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['family_name']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['relationship']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['family_age']?? "-"}} Tahun</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['family_occupation']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['family_occupation_name']?? "-"}}</td>
                                </tr>
                                @endforeach
                            </table>
                        </div>

                        <!-- /* part 3 : butiran pendidikan */ -->
                        <div class="mt-2">
                            <div class="py-1 border border-black text-center">
                                <div class="uppercase px-1 py-0 font-bold text-sm" >Taraf Pendidikan</div>
                            </div>
                            <table class="border w-full" border="1">
                                <tr class="py-3 border border-black bg-gray-200">
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Sekolah/IPT</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Dari</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Hingga</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Tahap</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Nama Program</td>
                                    {{-- <td class="uppercase px-1 py-1" colspan="5"></td> --}}
                                </tr>  

                                @foreach($application_snapshot['education']?? [] as $relative_data)
                                <tr class="py-3">
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['school_name']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['start_school']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['end_school']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['education_level']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['education_field']?? "-"}}</td>
                                </tr>
                                @endforeach
                            </table>
                        </div>
                    </div>

                    @pageBreak

                    <div>
                        <!-- /* part 4 : butiran pengalaman pekerjaan */ -->
                        <div class="mt-6">
                            <div class="py-1 border border-black text-center">
                                <div class="uppercase px-1 py-0 font-bold text-sm" >Pengalaman Pekerjaan</div>
                            </div>
                            <table class="border w-full" border="1">
                                <tr class="py-3 border border-black bg-gray-200">
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Nama Majikan</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Jawatan</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Dari</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Hingga</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Gaji Akhir</td>
                                    <td class="uppercase px-1 py-1 border border-black text-sm font-bold">Sebab Berhenti</td>
                                    {{-- <td class="uppercase px-1 py-1" colspan="5"></td> --}}
                                </tr>  
                                
                                @if(isset($application_snapshot['employers']))

                                @foreach(($application_snapshot['employers']) as $relative_data)
                                <tr class="py-3">
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['employer_name']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['position']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['start_year']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['end_year']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['final_salary']?? "-"}}</td>
                                    <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$relative_data['reason_for_leaving']?? "-"}}</td>
                                </tr>
                                @endforeach
                                @endif
                            </table>
                        </div>
                        
                        <!-- /* part 5 : butiran pekerjaan */ -->
                        <div class='border mt-2 text-sm'>
                            <div class="text-center font-bold text-sm">MAKLUMAT TAMBAHAN MENGENAI PEKERJAAN SEMASA/TERAKHIR</div>   
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'>
                                    Gaji Semasa : <?php echo 'RM' . number_format($application_snapshot['salary']?? "0", 2, '.', ',');  ?>
                                </div>
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'>
                                    Elaun Semasa(jika ada) : <?php echo 'RM' . number_format($application_snapshot['allowance']?? 0, 2, '.', ',');  ?>
                                </div>
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'>
                                    Laporkan kepada siapa? : {{$application_snapshot['report_to']?? "-"}}
                                </div>
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'>
                                    Bilangan Orang yang Melaporkan Kepada Anda : {{$application_snapshot['report_count']?? "-"}}
                                </div>
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='uppercase px-1 py-1 text-sm'>
                                    Tempoh Notis Perletakan Jawatan Untuk Pekerjaan Semasa : {{$application_snapshot['notice_period']?? "-"}} minggu
                                </div>
                            </div>
                        </div>
                         
                        <!-- /* part 6 : penguasaan bahasa */ -->   
                        <div>
                            <div class='mt-4'>
                                <div class="py-1 border border-black text-center">
                                    <p class='text-l font-bold text-sm'>PENGUASAAN BAHASA</p>
                                </div>
                                
                                <table class="border w-full" border="1">
                                    <thead>
                                        <tr class="py-3 border border-black bg-gray-200">
                                            <th class="uppercase px-1 py-1 border border-black text-sm font-bold">NAMA BAHASA</th>
                                            <th class="uppercase px-1 py-1 border border-black text-sm font-bold">STATUS PENGUASAAN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="py-3 border border-black">
                                            <td class="uppercase px-1 py-1 border border-black text-xs font-medium">Bahasa Melayu</td>
                                            <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$application_snapshot['language_malay']}}</td>
                                        </tr>
                                        <tr class="py-3 border border-black">
                                            <td class="uppercase px-1 py-1 border border-black text-xs font-medium">Bahasa Inggeris</td>
                                            <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$application_snapshot['language_english']}}
                                        </tr>
                                        <tr class="py-3 border border-black">
                                            <td class="uppercase px-1 py-1 border border-black text-xs font-medium">Bahasa lain(jika ada):{{$application_snapshot['other_language']?? "-"}}</td>
                                            <td class="uppercase px-1 py-1 border border-black text-xs font-medium">{{$application_snapshot['language']?? "-"}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                         
                        <!-- /* part 7 : maklumat lain */ -->
                        <div class='mt-4 border text-sm'>
                            <div class="text-center font-bold text-xs">MAKLUMAT LAIN</div>   
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    1. Adakah anda pernah didakwa dan disabitkan dalam mana-mana mahkamah 
                                    undang-undang untuk kesalahan jenayah atau Kesalahan dibawah Akta Dadah
                                    Berbahaya 1952? 
                                <div class='font-bold'>{{$application_snapshot['crime_charge']}}</div>
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    2. Adakah anda diisytiharkan bankrap?
                                <div class='font-bold'>{{$application_snapshot['bankruptcy']}}</div>     
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    3. Adakah anda terlibat dalam sebarang usaha perniagaan,
                                    termasuk perniagaan keluarga? 
                                <div class='font-bold'>{{$application_snapshot['business_involvement']}}</div>    
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    4. Adakah anda mempunyai lesen memandu?
                                <div class='font-bold'>{{$application_snapshot['license']}}, {{$application_snapshot['license_details']?? "-"}}</div>    
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    5. Adakah anda seorang perokok?
                                <div class='font-bold'>{{$application_snapshot['smoker']}}</div>    
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    6. Adakah anda seorang peminum arak?
                                <div class='font-bold'>{{$application_snapshot['drinker']}}</div>    
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    @pageBreak

                    <div>
                        <!-- /* part 8 : maklumat perubatan */ -->
                        <div class='mt-6 border text-sm'>
                            <div class="text-center font-bold text-sm">PERUBATAN & KEADAAN FIZIKAL</div>   
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    1. Pernahkah anda atau sedang mengalami sebarang penyakit?
                                <div class='font-bold'>{{$application_snapshot['medical_condition']}}</div>     
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    2. Adakah anda mengalami kecacatan fizikal? 
                                <div class='font-bold'>{{$application_snapshot['physical_disability']}}</div>    
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    3. Adakah anda sedang hamil atau merancang memiliki bayi tidak lama lagi? 
                                    <div class='font-bold'>{{$application_snapshot['pregnancy_status']}}</div>
                                </div>
                                
                            </div>
                        </div>
                    
                        <!-- /* part 9 : maklumat kemahiran*/ -->
                        <div class='mt-2 border text-sm'>
                            <div class="text-center font-bold text-sm">KEMAHIRAN/BAKAT/HOBI</div>   
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1 font-bold'>{{$application_snapshot['achievement']?? "-"}}</div>
                            </div>
                        </div>

                        <!-- /* part 10 : maklumat waris*/ -->
                        <div class='mt-2 border text-sm'>
                            <div class="text-center font-bold text-sm">ORANG UNTUK DIHUBUNGI JIKA BERLAKU KECEMASAN</div>   
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    Nama
                                <div class='font-bold'>{{$application_snapshot['reference_name_1']}}</div>    
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    Hubungan
                                <div class='font-bold'>{{$application_snapshot['reference_relationship_1']}}</div>    
                                </div>
                                
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    No. Telefon
                                <div class='font-bold'>{{$application_snapshot['reference_phone_1']}}</div>                                    
                                </div>
                            </div>
                        </div>

                        <!-- /* part 11 : maklumat rujukan*/ -->
                        <div class='mt-2 border text-sm'>
                            <div class="text-center font-bold text-sm">ORANG UNTUK DIHUBUNGI JIKA BERLAKU KECEMASAN</div>   
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    Nama
                                    <div class='font-bold'>{{$application_snapshot['reference_name_2']?? "-"}}</div>
                                </div>                               
                            </div>
                            
                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    No. Telefon
                                    <div class='font-bold'>{{$application_snapshot['reference_phone_2']?? "-"}}</div>
                                </div>                               
                            </div>

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    Nama Syarikat
                                <div class='font-bold'>{{$application_snapshot['reference_company_2']?? "-"}}</div>    
                                </div>                                
                            </div> 

                            <div class='grid flex-1 gap-2 my-2'>
                                <div class='px-1 py-1'>
                                    Jawatan
                                <div class='font-bold'>{{$application_snapshot['reference_position_2']?? "-"}}</div>    
                                </div>
                                
                            </div> 
                        </div>
                        <div class='mt-4'>
                            <div class="font-bold">PENGESAHAN PENGHANTARAN BORANG</div>
                        </div>

                        <div class='mt-4'>
                            <p class='text-sm'>SAYA MENGESAHKAN BAHAWA KETERANGAN-KETERANGAN DAN MAKLUMAT-MAKLUMAT YANG DIBERIKAN ADALAH 
                                BENAR, SAYA SETUJU JIKA DIDAPATI ADA KETERANGAN YANG TIDAK BENAR, SAYA BOLEH DIBERHENTIKAN DENGAN SERTA MERTA OLEH PIHAK SYARIKAT.
                            </p>                    
                        </div>
                    <div class="mt-2 uppercase text-sm font-bold">{{$application_snapshot['name']}}, <?php echo date_format(new DateTime($application['created_at']), "j/m/Y"); ?></div>
                    <div>UUID {{$application['id']}} JOB UUID {{$application['vacancy_uuid']}}</div>
                    </div>
                </div>
            
        </div>
    </div>
</body>
</html>